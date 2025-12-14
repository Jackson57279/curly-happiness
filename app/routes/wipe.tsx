import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { usePuterStore } from "~/lib/puter";

const WipeApp = () => {
    const { auth, isLoading, error, fs, kv } = usePuterStore();
    const navigate = useNavigate();
    const [files, setFiles] = useState<FSItem[]>([]);

    const loadFiles = useCallback(async () => {
        const files = (await fs.readDir("./"))!;
        setFiles(files);
    }, [fs]);

    useEffect(() => {
        void loadFiles();
    }, [loadFiles]);

    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) {
            void navigate("/auth?next=/wipe");
        }
    }, [isLoading, auth.isAuthenticated, navigate]);

    const handleDelete = async () => {
        await Promise.all(files.map(async (file) => {
            await fs.delete(file.path);
        }));
        await kv.flush();
        void loadFiles();
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error {error}</div>;
    }

    return (
        <div>
            Authenticated as: {auth.user?.username}
            <div>Existing files:</div>
            <div className="flex flex-col gap-4">
                {files.map((file) => (
                    <div key={file.id} className="flex flex-row gap-4">
                        <p>{file.name}</p>
                    </div>
                ))}
            </div>
            <div>
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer"
                    onClick={() => void handleDelete()}
                >
                    Wipe App Data
                </button>
            </div>
        </div>
    );
};

export default WipeApp;
