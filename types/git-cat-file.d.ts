/**
 * https://github.com/kawanet/git-cat-file
 */

export declare namespace GCF {
    type ObjType = "blob" | "commit" | "tag" | "tree";

    interface Repo {
        /**
         * Reads the raw object identified by its full SHA-1 object id.
         */
        getObject(object_id: string): Promise<IObject>;

        /**
         * Resolves the commit referenced by a branch name, tag, short sha,
         * or any other revision spec accepted by `git rev-parse`.
         */
        getCommit(commit_id: string): Promise<Commit>;

        /**
         * Reads the tree object identified by its full SHA-1 object id.
         */
        getTree(object_id: string): Promise<Tree>;
    }

    interface Commit {
        getId(): string;

        getMeta(key: keyof CommitMeta): string;

        getDate(): Date;

        getMessage(): string;

        getTree(): Promise<Tree>;

        getFile(path: string): Promise<File>;

        getParents(): Promise<Commit[]>;
    }

    interface Tag {
        getId(): string;

        getMeta(key: keyof TagMeta): string;

        getDate(): Date;

        getMessage(): string;
    }

    interface Tree {
        getId(): string;

        getEntries(): Promise<Entry[]>;

        getEntry(path: string): Promise<Entry>;

        getTree(path: string): Promise<Tree>;
    }

    interface IObject {
        oid: string;
        type: ObjType;
        data: Buffer;
    }

    interface Entry {
        mode: FileMode;
        name: string;
        oid: string;
    }

    interface CommitMeta {
        tree: string;
        parent: string;
        author: string;
        committer: string;
        encoding: string;
    }

    interface TagMeta {
        object: string;
        type: string;
        tagger: string;
        tag: string;
    }

    interface File {
        oid: string;
        mode: FileMode;
        data: Buffer;
    }

    interface FileMode {
        toString(): string;

        isFile: boolean; // 100644
        isExecutable: boolean; // 100755
        isSymlink: boolean; // 120000
        isSubmodule: boolean; // 160000
        isDirectory: boolean; // 040000
    }
}

export function openLocalRepo(path: string): GCF.Repo;
