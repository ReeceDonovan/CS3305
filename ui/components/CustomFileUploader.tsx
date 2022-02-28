import React, { useState, useContext, useEffect } from "react";
import {
  FileUploaderDropContainer,
  FileUploaderDropContainerProps,
  FileUploaderItem,
} from "carbon-components-react";
import { FileRef } from "../api/types";
import { NetworkManagerContext } from "./NetworkManager";
interface CustomFileUploaderProps extends FileUploaderDropContainerProps {
  remote_file_url?: string;
  init_file?: string;
  get_remote_file_url?: () => Promise<string>;
}

export default function CustomFileUploader(props: CustomFileUploaderProps) {
  const [file, setFile] = useState<FileRef | null>(null);

  useEffect(() => {
    if (props.init_file) {
      setFile({ name: props.init_file, status: "edit" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const nm_ctx = useContext(NetworkManagerContext);

  const onAddFiles = async (
    evt: { stopPropagation: () => void },
    { addedFiles }: any
  ) => {
    const url = props.remote_file_url
      ? props.remote_file_url
      : await props.get_remote_file_url;
    evt.stopPropagation();
    const new_file: File = addedFiles[0];
    setFile({ name: new_file.name, status: "uploading" } as FileRef);
    const form_data = new FormData();
    form_data.append("pdf_form", new_file);
    const [_res, err_code] = await nm_ctx.request({
      method: "POST",
      path: url as string,
      data: form_data,
    });
    if (err_code === 0) {
      setFile({ name: new_file.name, status: "edit" });
    } else {
      setFile(null);
    }
  };

  const remove_file = async (_e: any, _content: { uuid: string }) => {
    setFile({ name: file?.name as string, status: "uploading" });
    const [_res, err_code] = await nm_ctx.request({
      method: "DELETE",
      path: props.remote_file_url
        ? props.remote_file_url
        : await props.get_remote_file_url(),
    });

    if (err_code === 0) {
      setFile(null);
    } else {
      console.log(err_code);
    }
  };

  return (
    <div style={{ marginBottom: "1em", height: "7em" }}>
      {file ? (
        <FileUploaderItem
          status={file.status}
          name={file.name}
          onDelete={remove_file}
          style={{ width: "100%", height: "100%" }}
          onClick={async () => {
            const [blob, err_code] = await nm_ctx.fetchFile({
              method: "GET",
              path: props.remote_file_url ? props.remote_file_url : "",
            });
            if (err_code === 0) {
              // Stolen from https://github.com/eligrey/FileSaver.js/
              const a = document.createElement("a");
              const name = "form.pdf";
              a.download = name;
              a.rel = "noopener"; // tabnabbing
              // ignore  error cause if err_code is 0 then this is not standard response
              a.href = URL.createObjectURL(blob);
              a.click();
            }
          }}
        />
      ) : (
        <FileUploaderDropContainer
          {...(props as FileUploaderDropContainerProps)}
          onAddFiles={onAddFiles}
        />
      )}
    </div>
  );
}
