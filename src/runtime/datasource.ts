import { DataSourceBlock, createBlockID } from "../model/block";
import { Type, Variable, detectType } from "../model/variables";
import { File, FileStore } from "./filestore";
import { Workspace } from "./workspace";

interface FileInfo {
    data: any;
    type: Type;
}

function parseCSV(fileContent: ArrayBuffer): FileInfo {
    return {
        type: { base: "any" },
        data: "TODO"
    }
}

function parseJSON(fileContent: ArrayBuffer): FileInfo {
    const data = JSON.parse(new TextDecoder().decode(fileContent));

    // TODO: Rewrite to Table if array of objects
    return {
        type: detectType(data),
        data
    }
}

const parsedFileCache = new Map<string, FileInfo>();

export async function getFileInfo(file: File, store: FileStore): Promise<FileInfo> {
    if (parsedFileCache.has(file.fullPath())) {
        return parsedFileCache.get(file.fullPath())!;
    }

    const data = await store.getFileData(file);

    let result: FileInfo;
    switch(file.sourcetype) {
        case "csv":
            result = parseCSV(data);
            break;
        case "json":
            result = parseJSON(data);
            break;
    }

    console.log("built file info", file, result);

    parsedFileCache.set(file.fullPath(), result);
    return result;
}

export async function createDatasource(file: File, workspace: Workspace): Promise<DataSourceBlock> {
    const fileInfo = await getFileInfo(file, workspace.getFiles());

    const outVar: Variable = {
        name: file.deriveVariableName(),
        type: fileInfo.type
    };

    return {
        type: "datasource",
        blockID: createBlockID(),
        inputs: [],
        name: file.name,
        path: file.fullPath(),
        output: [outVar],
        sourcetype: file.sourcetype,
    }
}