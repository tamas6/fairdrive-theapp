import { FileResponse } from '@api/files';
import { FC } from 'react';

interface FilePreviewProps {
  file: FileResponse;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  source: any;
  onError: () => void;
}

const VIDEO_FILE_EXTENSIONS = [
  '.mpg',
  '.mp2',
  '.mpeg',
  '.mpe',
  '.mpv',
  '.ogg',
  '.webm',
  '.mp4',
  '.m4p',
  '.m4v',
  '.avi',
  '.wmv',
  '.mov',
  '.qt',
  '.flv',
  '.swf',
];

function isString(data: unknown): boolean {
  return typeof data === 'string';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isFileConsent(data: any): boolean {
  return (
    typeof data === 'object' &&
    typeof data.data_controller === 'object' &&
    Array.isArray(data.purpose) &&
    Array.isArray(data.sensitive) &&
    isString(data.jurisdiction) &&
    isString(data.moc) &&
    isString(data.sub) &&
    isString(data.notice) &&
    isString(data.policy_uri) &&
    isString(data.scopes) &&
    isString(data.iss) &&
    isString(data.jti)
  );
}

function isFileVideo(fileName: string): boolean {
  const lowercaseFileName = fileName.toLowerCase();
  return VIDEO_FILE_EXTENSIONS.some((extension) =>
    lowercaseFileName.endsWith(extension)
  );
}

const FilePreview: FC<FilePreviewProps> = ({ file, source, onError }) => {
  if (isFileConsent(source)) {
    return <div className="w-full h-auto my-10 rounded">Consent Document</div>;
  }

  if (isFileVideo(file.name || '')) {
    return (
      <video className="w-full h-auto my-10 rounded" controls>
        <source src={source} />
      </video>
    );
  }

  return (
    <img
      src={source}
      alt="Preview Image"
      className="w-full h-auto my-10 rounded"
      onError={onError}
    />
  );
};

export default FilePreview;
