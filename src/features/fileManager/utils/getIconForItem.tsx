import React from 'react';
import FolderIcon from '@mui/icons-material/Folder';
import ArticleIcon from '@mui/icons-material/Article';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import AudioFileIcon from '@mui/icons-material/AudioFile';
import DescriptionIcon from '@mui/icons-material/Description'; // Keep for docx etc.
import TableChartIcon from '@mui/icons-material/TableChart';
import CodeIcon from '@mui/icons-material/Code';
import FolderZipIcon from '@mui/icons-material/FolderZip';

// *** Import types from src-new ***
import { Folder, File } from '../../../types/document'; // Adjust path based on final location
import { isFolder as isFolderGuard } from '../../../types/typeGuards'; // Adjust path

// Combine types for the function argument
type ItemType = Folder | File;

// Expanded mapping based on mime types or extensions
const iconMap: Record<string, React.ElementType> = {
  // Mime Types (Examples)
  'application/pdf': PictureAsPdfIcon,
  'image/jpeg': ImageIcon,
  'image/png': ImageIcon,
  'image/gif': ImageIcon,
  'image/webp': ImageIcon,
  'image/svg+xml': ImageIcon,
  'video/mp4': VideoFileIcon,
  'video/webm': VideoFileIcon,
  'video/quicktime': VideoFileIcon,
  'audio/mpeg': AudioFileIcon,
  'audio/ogg': AudioFileIcon,
  'audio/wav': AudioFileIcon,
  'application/msword': DescriptionIcon,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': DescriptionIcon, // docx
  'application/vnd.ms-excel': TableChartIcon,
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': TableChartIcon, // xlsx
  'application/vnd.ms-powerpoint': ArticleIcon, // Defaulting ppt/pptx to Article for now
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': ArticleIcon,
  'text/plain': DescriptionIcon,
  'text/html': CodeIcon,
  'text/css': CodeIcon,
  'application/javascript': CodeIcon,
  'application/json': CodeIcon,
  'application/zip': FolderZipIcon,
  'application/x-rar-compressed': FolderZipIcon,
  'application/x-7z-compressed': FolderZipIcon,
  'application/x-tar': FolderZipIcon,
  'application/gzip': FolderZipIcon,
  // Extensions (Fallback if mimeType is generic)
  'pdf': PictureAsPdfIcon,
  'jpg': ImageIcon, 'jpeg': ImageIcon, 'png': ImageIcon, 'gif': ImageIcon, 'webp': ImageIcon, 'svg': ImageIcon,
  'mp4': VideoFileIcon, 'mov': VideoFileIcon, 'avi': VideoFileIcon, 'wmv': VideoFileIcon,
  'mp3': AudioFileIcon, 'wav': AudioFileIcon, 'ogg': AudioFileIcon, 'm4a': AudioFileIcon,
  'doc': DescriptionIcon, 'docx': DescriptionIcon, 'txt': DescriptionIcon,
  'xls': TableChartIcon, 'xlsx': TableChartIcon, 'csv': TableChartIcon,
  'ppt': ArticleIcon, 'pptx': ArticleIcon,
  'js': CodeIcon, 'ts': CodeIcon, 'jsx': CodeIcon, 'tsx': CodeIcon, 'html': CodeIcon, 'css': CodeIcon, 'py': CodeIcon, 'java': CodeIcon,
  'zip': FolderZipIcon, 'rar': FolderZipIcon, '7z': FolderZipIcon, 'tar': FolderZipIcon, 'gz': FolderZipIcon,
};

export const getIconForItem = (item: ItemType | null | undefined): React.ReactNode => {
  if (!item) {
    console.warn('getIconForItem: Received invalid item', item);
    return <ArticleIcon sx={{ color: 'grey.500' }} />; // Default fallback icon
  }

  if (isFolderGuard(item)) {
    // Use item.color for folder if available, otherwise default
    return <FolderIcon sx={{ color: item.color ?? 'action.active' }} />;
  } else {
    // It's an AppFile
    const file = item as File;
    // Prioritize mimeType, fallback to extension
    const typeString = file.mimeType || file.extension || 'unknown';
    // Normalize mime type (e.g., 'text/plain;charset=UTF-8' -> 'text/plain')
    const normalizedType = typeString.split(';')[0].toLowerCase();

    const IconComponent: React.ElementType = iconMap[normalizedType] || iconMap[file.extension?.toLowerCase() || ''] || ArticleIcon;
    // Use a default color or derive from theme if iconColor isn't on AppFile
    return <IconComponent sx={{ color: 'action.active' }} />; // Changed color logic as iconColor isn't on AppFile
  }
};
