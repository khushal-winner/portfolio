import { useState, useEffect } from "react";
import { Lock, Save, LogOut, FileText, Menu, Plus, X, Folder, FolderOpen, ChevronRight, ChevronDown, MoreVertical, Upload } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { createClient } from "@insforge/sdk";

interface File {
  id: string;
  name: string;
  path: string;
  isCustom: boolean;
  content?: string;
  folderId?: string;
}

interface Folder {
  id: string;
  name: string;
  isExpanded: boolean;
}

const CORRECT_PASSWORD = import.meta.env.VITE_NOTES_PASSWORD || "your-secret-password";

// Initialize InsForge client
const client = createClient({
  baseUrl: import.meta.env.VITE_INSFORGE_BASE_URL || "",
  anonKey: import.meta.env.VITE_INSFORGE_ANON_KEY || "",
});

export default function Notes() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("notes-auth") === "true";
  });
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [markdownContent, setMarkdownContent] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showNewFileModal, setShowNewFileModal] = useState(false);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [newFileContent, setNewFileContent] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [draggedFileId, setDraggedFileId] = useState<string | null>(null);
  const [openFolderMenuId, setOpenFolderMenuId] = useState<string | null>(null);
  const [folderToDelete, setFolderToDelete] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFileName, setUploadFileName] = useState("");
  const [uploadFileContent, setUploadFileContent] = useState("");
  const PYTHON_FOLDER_ID = "folder-python";

  const [files, setFiles] = useState<File[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);

  // Load data from InsForge database
  useEffect(() => {
    if (!isAuthenticated) return;

    const loadData = async () => {
      setIsLoading(true);
      setDbError(null);

      try {
        // Load folders
        const { data: foldersData, error: foldersError } = await client
          .from("notes_folders")
          .select("*")
          .order("created_at", { ascending: true });

        if (foldersError) throw foldersError;

        // Load files
        const { data: filesData, error: filesError } = await client
          .from("notes_files")
          .select("*")
          .order("created_at", { ascending: true });

        if (filesError) throw filesError;

        // Load quick notes
        const { data: notesData, error: notesError } = await client
          .from("notes_quick")
          .select("content")
          .single();

        if (notesError && notesError.code !== "PGRST116") throw notesError;

        // Set default data if empty
        if (!foldersData || foldersData.length === 0) {
          // Create default Python folder
          const { data: newFolder, error: createError } = await client
            .from("notes_folders")
            .insert([{ id: PYTHON_FOLDER_ID, name: "Python", is_expanded: true }])
            .select()
            .single();

          if (createError) throw createError;
          setFolders([{ id: PYTHON_FOLDER_ID, name: "Python", isExpanded: true }]);
        } else {
          setFolders(foldersData.map((f: { id: string; name: string; is_expanded: boolean }) => ({
            id: f.id,
            name: f.name,
            isExpanded: f.is_expanded
          })));
        }

        if (!filesData || filesData.length === 0) {
          // Create default files
          const defaultFiles = [
            { id: "python-chapter1", name: "Python Chapter 1", path: "/notes/python-chapter1.md", is_custom: false, folder_id: PYTHON_FOLDER_ID, content: null },
            { id: "python-chapter2", name: "Python Chapter 2", path: "/notes/python-chapter2.md", is_custom: false, folder_id: PYTHON_FOLDER_ID, content: null }
          ];

          const { error: createFilesError } = await client
            .from("notes_files")
            .insert(defaultFiles);

          if (createFilesError) throw createFilesError;

          setFiles([
            { id: "python-chapter1", name: "Python Chapter 1", path: "/notes/python-chapter1.md", isCustom: false, folderId: PYTHON_FOLDER_ID },
            { id: "python-chapter2", name: "Python Chapter 2", path: "/notes/python-chapter2.md", isCustom: false, folderId: PYTHON_FOLDER_ID }
          ]);
        } else {
          setFiles(filesData.map((f: { id: string; name: string; path: string; is_custom: boolean; folder_id: string | null; content: string | null }) => ({
            id: f.id,
            name: f.name,
            path: f.path,
            isCustom: f.is_custom,
            folderId: f.folder_id || undefined,
            content: f.content || undefined
          })));
        }

        if (notesData) {
          setNotes(notesData.content);
        }
      } catch (err) {
        console.error("Database error:", err);
        setDbError("Failed to load data from database. Please check your connection.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [isAuthenticated]);

  // Close folder menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenFolderMenuId(null);
    };

    if (openFolderMenuId) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openFolderMenuId]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem("notes-auth", "true");
      setError("");
    } else {
      setError("Incorrect password");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("notes-auth");
    setPassword("");
  };

  const handleSaveNotes = async () => {
    try {
      const { error } = await client
        .from("notes_quick")
        .upsert({ id: "default", content: notes }, { onConflict: "id" });

      if (error) throw error;
    } catch (err) {
      console.error("Failed to save notes:", err);
      setDbError("Failed to save notes");
    }
  };

  const loadMarkdownFile = async (filePath: string, isCustom: boolean, content?: string) => {
    try {
      if (isCustom && content) {
        setMarkdownContent(content);
        setActiveFile(filePath);
      } else {
        console.log("Loading file:", filePath);
        const response = await fetch(filePath);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        console.log("File loaded successfully, length:", text.length);
        setMarkdownContent(text);
        setActiveFile(filePath);
      }
    } catch (error) {
      console.error("Error loading markdown file:", error);
      setMarkdownContent(`Error loading file: ${error}`);
    }
  };

  const handleCreateFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;

    const newFile = {
      id: Date.now().toString(),
      name: newFileName,
      path: `custom-${Date.now()}`,
      is_custom: true,
      content: newFileContent,
      folder_id: selectedFolderId || null
    };

    try {
      const { error } = await client
        .from("notes_files")
        .insert([newFile]);

      if (error) throw error;

      const updatedFiles: File[] = [...files, {
        id: newFile.id,
        name: newFile.name,
        path: newFile.path,
        isCustom: true,
        content: newFileContent,
        folderId: selectedFolderId || undefined
      }];
      setFiles(updatedFiles);
      setNewFileName("");
      setNewFileContent("");
      setSelectedFolderId(null);
      setShowNewFileModal(false);
    } catch (err) {
      console.error("Failed to create file:", err);
      setDbError("Failed to create file");
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    try {
      const { error } = await client
        .from("notes_files")
        .delete()
        .eq("id", fileId);

      if (error) throw error;

      const updatedFiles = files.filter(f => f.id !== fileId);
      setFiles(updatedFiles);
      if (activeFile === fileId) {
        setActiveFile(null);
        setMarkdownContent("");
      }
    } catch (err) {
      console.error("Failed to delete file:", err);
      setDbError("Failed to delete file");
    }
  };

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    const newFolder: Folder = {
      id: Date.now().toString(),
      name: newFolderName,
      isExpanded: true
    };

    try {
      const { error } = await client
        .from("notes_folders")
        .insert([{ id: newFolder.id, name: newFolder.name, is_expanded: true }]);

      if (error) throw error;

      const updatedFolders = [...folders, newFolder];
      setFolders(updatedFolders);
      setNewFolderName("");
      setShowNewFolderModal(false);
    } catch (err) {
      console.error("Failed to create folder:", err);
      setDbError("Failed to create folder");
    }
  };

  const handleToggleFolder = async (folderId: string) => {
    const folder = folders.find(f => f.id === folderId);
    if (!folder) return;

    try {
      const { error } = await client
        .from("notes_folders")
        .update({ is_expanded: !folder.isExpanded })
        .eq("id", folderId);

      if (error) throw error;

      const updatedFolders = folders.map(f =>
        f.id === folderId ? { ...f, isExpanded: !f.isExpanded } : f
      );
      setFolders(updatedFolders);
    } catch (err) {
      console.error("Failed to update folder:", err);
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    try {
      // Move all files from this folder to root in database
      const { error: filesError } = await client
        .from("notes_files")
        .update({ folder_id: null })
        .eq("folder_id", folderId);

      if (filesError) throw filesError;

      // Delete the folder from database
      const { error: folderError } = await client
        .from("notes_folders")
        .delete()
        .eq("id", folderId);

      if (folderError) throw folderError;

      // Update local state
      const updatedFiles = files.map(f =>
        f.folderId === folderId ? { ...f, folderId: undefined } : f
      );
      setFiles(updatedFiles);

      const updatedFolders = folders.filter(f => f.id !== folderId);
      setFolders(updatedFolders);
    } catch (err) {
      console.error("Failed to delete folder:", err);
      setDbError("Failed to delete folder");
    }
  };

  const handleDragStart = (e: React.DragEvent, fileId: string) => {
    setDraggedFileId(fileId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData('text/plain', fileId);
    console.log('Drag started:', fileId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e: React.DragEvent, folderId: string) => {
    e.preventDefault();
    if (!draggedFileId) return;

    try {
      // Update file folder in database
      const { error } = await client
        .from("notes_files")
        .update({ folder_id: folderId })
        .eq("id", draggedFileId);

      if (error) throw error;

      // Update local state
      const updatedFiles = files.map(f =>
        f.id === draggedFileId ? { ...f, folderId } : f
      );
      setFiles(updatedFiles);

      // Auto-expand folder
      const { error: folderError } = await client
        .from("notes_folders")
        .update({ is_expanded: true })
        .eq("id", folderId);

      if (folderError) throw folderError;

      const updatedFolders = folders.map(f =>
        f.id === folderId ? { ...f, isExpanded: true } : f
      );
      setFolders(updatedFolders);

      setDraggedFileId(null);
    } catch (err) {
      console.error("Failed to move file:", err);
      setDbError("Failed to move file");
    }
  };

  const handleDropOnRoot = async (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedFileId) return;

    try {
      // Remove file from folder in database
      const { error } = await client
        .from("notes_files")
        .update({ folder_id: null })
        .eq("id", draggedFileId);

      if (error) throw error;

      const updatedFiles = files.map(f =>
        f.id === draggedFileId ? { ...f, folderId: undefined } : f
      );
      setFiles(updatedFiles);
      setDraggedFileId(null);
    } catch (err) {
      console.error("Failed to move file:", err);
      setDbError("Failed to move file");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.md')) {
      alert('Please upload a .md (markdown) file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setUploadFileContent(content);
      setUploadFileName(file.name.replace('.md', ''));
      setShowUploadModal(true);
    };
    reader.readAsText(file);
  };

  const handleSaveUploadedFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFileName.trim()) return;

    const newFile = {
      id: Date.now().toString(),
      name: uploadFileName,
      path: `custom-${Date.now()}`,
      is_custom: true,
      content: uploadFileContent,
      folder_id: selectedFolderId || null
    };

    try {
      const { error } = await client
        .from("notes_files")
        .insert([newFile]);

      if (error) throw error;

      const updatedFiles: File[] = [...files, {
        id: newFile.id,
        name: newFile.name,
        path: newFile.path,
        isCustom: true,
        content: uploadFileContent,
        folderId: selectedFolderId || undefined
      }];
      setFiles(updatedFiles);

      setUploadFileName("");
      setUploadFileContent("");
      setSelectedFolderId(null);
      setShowUploadModal(false);
    } catch (err) {
      console.error("Failed to upload file:", err);
      setDbError("Failed to upload file");
    }
  };

  const handleMoveFileToFolder = async (fileId: string, folderId: string | null) => {
    try {
      // Update file folder in database
      const { error } = await client
        .from("notes_files")
        .update({ folder_id: folderId })
        .eq("id", fileId);

      if (error) throw error;

      // Update local state
      const updatedFiles = files.map(f =>
        f.id === fileId ? { ...f, folderId: folderId || undefined } : f
      );
      setFiles(updatedFiles);

      // If moving to a folder, expand it
      if (folderId) {
        const { error: folderError } = await client
          .from("notes_folders")
          .update({ is_expanded: true })
          .eq("id", folderId);

        if (folderError) throw folderError;

        const updatedFolders = folders.map(f =>
          f.id === folderId ? { ...f, isExpanded: true } : f
        );
        setFolders(updatedFolders);
      }
    } catch (err) {
      console.error("Failed to move file:", err);
      setDbError("Failed to move file");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="bg-bg-secondary p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-6 h-6 text-text-primary" />
            <h2 className="text-2xl font-bold text-text-primary">Private Notes</h2>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Enter password"
              />
            </div>
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
            <button
              type="submit"
              className="w-full px-4 py-2 bg-accent text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              Unlock
            </button>
          </form>
          <p className="text-xs text-text-secondary mt-4 text-center">
            This section is password protected
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Error display */}
      {dbError && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          <p className="text-sm">{dbError}</p>
          <button
            onClick={() => setDbError(null)}
            className="text-xs underline mt-1 hover:text-gray-200"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Sidebar with file list */}
      <aside className={`w-64 bg-bg-secondary border-r border-border p-4 overflow-y-auto transition-all duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full absolute'}`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-text-primary">Notes</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowNewFolderModal(true)}
              className="text-text-secondary hover:text-text-primary transition-colors"
              title="Add new folder"
            >
              <Folder className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowNewFileModal(true)}
              className="text-text-secondary hover:text-text-primary transition-colors"
              title="Add new file"
            >
              <Plus className="w-4 h-4" />
            </button>
            <label className="text-text-secondary hover:text-text-primary transition-colors cursor-pointer" title="Upload .md file">
              <Upload className="w-4 h-4" />
              <input
                type="file"
                accept=".md"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <button
              onClick={handleLogout}
              className="text-text-secondary hover:text-text-primary transition-colors"
              title="Lock"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div
          className="space-y-2"
          onDragOver={handleDragOver}
          onDrop={handleDropOnRoot}
        >
          {/* Render folders */}
          {folders.map((folder: Folder) => (
            <div key={folder.id} className="space-y-1">
              <div
                className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-bg-primary cursor-pointer group transition-colors"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, folder.id)}
                onDragEnter={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add('bg-accent', 'opacity-30');
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('bg-accent', 'opacity-30');
                }}
                onDragEnd={(e) => {
                  e.currentTarget.classList.remove('bg-accent', 'opacity-30');
                }}
              >
                <button
                  onClick={() => handleToggleFolder(folder.id)}
                  className="text-text-secondary hover:text-text-primary"
                >
                  {folder.isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                {folder.isExpanded ? (
                  <FolderOpen className="w-4 h-4 text-text-secondary" />
                ) : (
                  <Folder className="w-4 h-4 text-text-secondary" />
                )}
                <span className="text-sm text-text-secondary flex-1">{folder.name}</span>
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenFolderMenuId(openFolderMenuId === folder.id ? null : folder.id);
                    }}
                    className="text-text-secondary hover:text-text-primary transition-colors p-1 rounded hover:bg-bg-primary"
                    title="Folder options"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {/* Dropdown menu */}
                  {openFolderMenuId === folder.id && (
                    <div className="absolute right-0 top-full mt-1 w-40 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-50 py-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setFolderToDelete(folder.id);
                          setOpenFolderMenuId(null);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-gray-700 transition-colors flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Delete Folder
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Render files in folder */}
              {folder.isExpanded && (
                <div className="ml-6 space-y-1">
                  {(() => {
                    const folderFiles = files.filter((f: File) => f.folderId === folder.id);
                    console.log(`Files in folder ${folder.name} (${folder.id}):`, folderFiles);
                    return folderFiles;
                  })()
                    .map((file: File) => (
                      <div key={file.id} className="group relative">
                        <div
                          draggable
                          onDragStart={(e) => handleDragStart(e, file.id)}
                          className={`group relative ${activeFile === file.path
                            ? "bg-accent text-white"
                            : "text-text-secondary hover:bg-bg-primary hover:text-text-primary"
                            }`}
                        >
                          <button
                            onClick={() => loadMarkdownFile(file.path, file.isCustom, file.content)}
                            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-left transition-colors cursor-move"
                          >
                            <FileText className="w-4 h-4 flex-shrink-0" />
                            <span className="text-sm truncate flex-1">{file.name}</span>
                          </button>
                          {/* Folder selection dropdown */}
                          <select
                            value={file.folderId || ""}
                            onChange={(e) => handleMoveFileToFolder(file.id, e.target.value || null)}
                            onClick={(e) => e.stopPropagation()}
                            className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 bg-gray-700 text-white text-xs rounded px-1 py-0.5 border border-gray-600 focus:outline-none focus:ring-1 focus:ring-accent"
                            title="Move to folder"
                          >
                            <option value="">No Folder</option>
                            {folders.map((f: Folder) => (
                              <option key={f.id} value={f.id}>
                                {f.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        {file.isCustom && (
                          <button
                            onClick={() => handleDeleteFile(file.id)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity"
                            title="Delete file"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          ))}

          {/* Render files not in any folder */}
          {files
            .filter((f: File) => !f.folderId)
            .map((file: File) => (
              <div key={file.id} className="group relative">
                <div
                  draggable
                  onDragStart={(e) => handleDragStart(e, file.id)}
                  className={`group relative ${activeFile === file.path
                    ? "bg-accent text-white"
                    : "text-text-secondary hover:bg-bg-primary hover:text-text-primary"
                    }`}
                >
                  <button
                    onClick={() => loadMarkdownFile(file.path, file.isCustom, file.content)}
                    className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-left transition-colors cursor-move"
                  >
                    <FileText className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm truncate flex-1">{file.name}</span>
                  </button>
                  {/* Folder selection dropdown */}
                  <select
                    value={file.folderId || ""}
                    onChange={(e) => handleMoveFileToFolder(file.id, e.target.value || null)}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 bg-gray-700 text-white text-xs rounded px-1 py-0.5 border border-gray-600 focus:outline-none focus:ring-1 focus:ring-accent"
                    title="Move to folder"
                  >
                    <option value="">No Folder</option>
                    {folders.map((f: Folder) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>
                {file.isCustom && (
                  <button
                    onClick={() => handleDeleteFile(file.id)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity"
                    title="Delete file"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <h4 className="text-xs font-semibold text-text-secondary mb-3 uppercase">
            Quick Notes
          </h4>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full h-32 px-3 py-2 bg-bg-primary border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none"
            placeholder="Quick notes..."
          />
          <button
            onClick={handleSaveNotes}
            className="flex items-center gap-2 px-3 py-1.5 mt-2 text-xs bg-accent text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            <Save className="w-3 h-3" />
            Save
          </button>
        </div>
      </aside>

      {/* Sidebar toggle button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-800 text-white p-2 rounded-r-lg hover:bg-gray-700 transition-colors"
        style={{ left: isSidebarOpen ? '16rem' : '0' }}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* New file modal */}
      {showNewFileModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Create New File</h3>
              <button
                onClick={() => setShowNewFileModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateFile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  File Name
                </label>
                <input
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="My Notes"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Folder (Optional)
                </label>
                <select
                  value={selectedFolderId || ""}
                  onChange={(e) => setSelectedFolderId(e.target.value || null)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="">No Folder</option>
                  {folders.map((folder: Folder) => (
                    <option key={folder.id} value={folder.id}>
                      {folder.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Content (Markdown)
                </label>
                <textarea
                  value={newFileContent}
                  onChange={(e) => setNewFileContent(e.target.value)}
                  className="w-full h-48 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                  placeholder="# My Notes&#10;&#10;Write your markdown here..."
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowNewFileModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-accent text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  Create File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New folder modal */}
      {showNewFolderModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Create New Folder</h3>
              <button
                onClick={() => setShowNewFolderModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateFolder} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Folder Name
                </label>
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="My Folder"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowNewFolderModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-accent text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  Create Folder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete folder confirmation modal */}
      {folderToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Delete Folder</h3>
              <button
                onClick={() => setFolderToDelete(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this folder? Files inside will be moved to the root level.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setFolderToDelete(null)}
                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (folderToDelete) {
                    handleDeleteFolder(folderToDelete);
                    setFolderToDelete(null);
                  }
                }}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload file modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Upload Markdown File</h3>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadFileName("");
                  setUploadFileContent("");
                  setSelectedFolderId(null);
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveUploadedFile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  File Name
                </label>
                <input
                  type="text"
                  value={uploadFileName}
                  onChange={(e) => setUploadFileName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="My Notes"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Folder (Optional)
                </label>
                <select
                  value={selectedFolderId || ""}
                  onChange={(e) => setSelectedFolderId(e.target.value || null)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="">No Folder</option>
                  {folders.map((folder: Folder) => (
                    <option key={folder.id} value={folder.id}>
                      {folder.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false);
                    setUploadFileName("");
                    setUploadFileContent("");
                    setSelectedFolderId(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-accent text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  Upload File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main content area */}
      <main className="flex-1 p-8 overflow-y-auto bg-gray-900 min-h-screen">
        {activeFile ? (
          <div className="max-w-4xl mx-auto prose prose-invert prose-lg">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-4xl font-bold text-white mb-6 mt-8 border-b border-gray-700 pb-4">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-3xl font-semibold text-white mb-4 mt-8">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-2xl font-semibold text-white mb-3 mt-6">
                    {children}
                  </h3>
                ),
                h4: ({ children }) => (
                  <h4 className="text-xl font-semibold text-gray-200 mb-2 mt-4">
                    {children}
                  </h4>
                ),
                p: ({ children }) => (
                  <p className="text-gray-300 mb-4 leading-7 text-base">
                    {children}
                  </p>
                ),
                strong: ({ children }) => (
                  <strong className="text-white font-semibold">
                    {children}
                  </strong>
                ),
                em: ({ children }) => (
                  <em className="text-gray-200 italic">
                    {children}
                  </em>
                ),
                code: ({ children, className }) => (
                  <code
                    className={`${className
                      ? "block bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm font-mono leading-relaxed"
                      : "bg-gray-800 px-2 py-1 rounded text-green-400 font-mono text-sm"
                      }`}
                  >
                    {children}
                  </code>
                ),
                pre: ({ children }) => (
                  <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto mb-6 border border-gray-700">
                    {children}
                  </pre>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2 ml-4">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside text-gray-300 mb-4 space-y-2 ml-4">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="text-gray-300 leading-relaxed">
                    {children}
                  </li>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-blue-500 pl-6 py-2 my-6 bg-gray-800/50 rounded-r-lg italic text-gray-300">
                    {children}
                  </blockquote>
                ),
                a: ({ children, href }) => (
                  <a
                    href={href}
                    className="text-blue-400 hover:text-blue-300 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto mb-6 rounded-lg border border-gray-700">
                    <table className="min-w-full">
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead className="bg-gray-800">
                    {children}
                  </thead>
                ),
                tbody: ({ children }) => (
                  <tbody className="divide-y divide-gray-700">
                    {children}
                  </tbody>
                ),
                tr: ({ children }) => (
                  <tr className="hover:bg-gray-800/50">
                    {children}
                  </tr>
                ),
                th: ({ children }) => (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {children}
                  </td>
                ),
                hr: () => (
                  <hr className="my-8 border-gray-700" />
                ),
              }}
            >
              {markdownContent}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-300">
            <p>Select a file from the sidebar to view</p>
          </div>
        )}
      </main>
    </div>
  );
}
