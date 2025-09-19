import React, { useState, useMemo } from "react";
import { invoke } from "@tauri-apps/api/core";
import { save } from "@tauri-apps/plugin-dialog";
import {
    Download,
    Copy,
    ZoomIn,
    ZoomOut,
    RotateCw,
    Maximize2,
    X,
    Image as ImageIcon
} from "lucide-react";
import { Button } from "./ui/button";
import { successToast, errorToast } from "./ui/toast";
import LazyImage from "./LazyImage";

interface ImageViewerProps {
    imageData: string;
    itemId: string;
    width?: number;
    height?: number;
    truncate?: boolean;
    className?: string;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({
    imageData,
    itemId,
    width: _width,
    height: _height,
    truncate = true,
    className = "",
}) => {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const handleSaveImage = async () => {
        try {
            setIsLoading(true);
            const filePath = await save({
                filters: [
                    {
                        name: "PNG Image",
                        extensions: ["png"],
                    },
                    {
                        name: "All Files",
                        extensions: ["*"],
                    },
                ],
                defaultPath: `spiegel-image-${Date.now()}.png`,
            });

            if (filePath) {
                await invoke("save_image_to_file", {
                    itemId,
                    filePath,
                });
                successToast("Image saved successfully!");
            }
        } catch (error) {
            console.error("Failed to save image:", error);
            errorToast("Failed to save image");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopyImage = async () => {
        try {
            setIsLoading(true);
            await invoke("copy_image_to_clipboard", { itemId });
            successToast("Image copied to clipboard!");
        } catch (error) {
            console.error("Failed to copy image:", error);
            errorToast("Failed to copy image");
        } finally {
            setIsLoading(false);
        }
    };

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.25));
    const handleRotate = () => setRotation(prev => (prev + 90) % 360);

    const imageSrc = useMemo(() => `data:image/png;base64,${imageData}`, [imageData]);

    const LoadingPlaceholder = () => (
        <div className="flex items-center justify-center text-gray-400">
            <ImageIcon className="h-6 w-6" />
        </div>
    );

    const ImageControls = () => (
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
                size="sm"
                variant="secondary"
                onClick={handleCopyImage}
                disabled={isLoading}
                className="h-6 w-6 p-0"
                title="Copy to clipboard"
            >
                <Copy className="h-3 w-3" />
            </Button>
            <Button
                size="sm"
                variant="secondary"
                onClick={handleSaveImage}
                disabled={isLoading}
                className="h-6 w-6 p-0"
                title="Save image"
            >
                <Download className="h-3 w-3" />
            </Button>
            {!truncate && (
                <>
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={handleZoomOut}
                        className="h-6 w-6 p-0"
                        title="Zoom out"
                    >
                        <ZoomOut className="h-3 w-3" />
                    </Button>
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={handleZoomIn}
                        className="h-6 w-6 p-0"
                        title="Zoom in"
                    >
                        <ZoomIn className="h-3 w-3" />
                    </Button>
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={handleRotate}
                        className="h-6 w-6 p-0"
                        title="Rotate"
                    >
                        <RotateCw className="h-3 w-3" />
                    </Button>
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setIsFullscreen(true)}
                        className="h-6 w-6 p-0"
                        title="Fullscreen"
                    >
                        <Maximize2 className="h-3 w-3" />
                    </Button>
                </>
            )}
        </div>
    );

    const imageElement = (
        <LazyImage
            src={imageSrc}
            alt="Clipboard image"
            className={`max-w-full max-h-full object-contain rounded transition-transform ${className}`}
            style={{
                maxHeight: truncate ? "60px" : "400px",
                maxWidth: truncate ? "100px" : "100%",
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                cursor: truncate ? "pointer" : "default",
            }}
            onClick={truncate ? () => setIsFullscreen(true) : undefined}
            placeholder={<LoadingPlaceholder />}
        />
    );

    if (isFullscreen) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
                <div className="relative max-w-[90vw] max-h-[90vh] group">
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setIsFullscreen(false)}
                        className="absolute top-4 right-4 z-10 h-8 w-8 p-0"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                    <div className="absolute top-4 left-4 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                            size="sm"
                            variant="secondary"
                            onClick={handleZoomOut}
                            className="h-8 w-8 p-0"
                            title="Zoom out"
                        >
                            <ZoomOut className="h-4 w-4" />
                        </Button>
                        <Button
                            size="sm"
                            variant="secondary"
                            onClick={handleZoomIn}
                            className="h-8 w-8 p-0"
                            title="Zoom in"
                        >
                            <ZoomIn className="h-4 w-4" />
                        </Button>
                        <Button
                            size="sm"
                            variant="secondary"
                            onClick={handleRotate}
                            className="h-8 w-8 p-0"
                            title="Rotate"
                        >
                            <RotateCw className="h-4 w-4" />
                        </Button>
                        <Button
                            size="sm"
                            variant="secondary"
                            onClick={handleCopyImage}
                            disabled={isLoading}
                            className="h-8 w-8 p-0"
                            title="Copy to clipboard"
                        >
                            <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                            size="sm"
                            variant="secondary"
                            onClick={handleSaveImage}
                            disabled={isLoading}
                            className="h-8 w-8 p-0"
                            title="Save image"
                        >
                            <Download className="h-4 w-4" />
                        </Button>
                    </div>
                    <LazyImage
                        src={imageSrc}
                        alt="Clipboard image fullscreen"
                        className="max-w-full max-h-full object-contain"
                        style={{
                            transform: `scale(${zoom}) rotate(${rotation}deg)`,
                        }}
                        placeholder={<LoadingPlaceholder />}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="relative group">
            {imageElement}
            <ImageControls />
        </div>
    );
};

export default ImageViewer;
