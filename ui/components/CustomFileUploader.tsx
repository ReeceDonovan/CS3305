import React, { useState, useContext } from "react";
import {
  FileUploaderDropContainer,
  FileUploaderDropContainerProps,
  FileUploaderItem,
} from "carbon-components-react";

import { FileRef } from "../api/types";
import { NetworkManagerContext } from "./NetworkManager";

interface CustomFileUploaderProps extends FileUploaderDropContainerProps {
  add_remote_file_url: string | null;
  delete_remote_file_url?: string;
  get_add_remote_file_url?: () => Promise<string>;
}

export default function CustomFileUploader(props: CustomFileUploaderProps) {
  const [file, setFile] = useState<FileRef | null>(null);
  const [invalid_flag, setInvalid_flag] = useState<boolean>(false);
  const nm_ctx = useContext(NetworkManagerContext);

  const onAddFiles = async (evt: { stopPropagation: () => void; }, { addedFiles }: any) => {
    let url = "";
    if (props.add_remote_file_url === null) {
      if (props.get_add_remote_file_url) {
        url = await props.get_add_remote_file_url();
      } else {
        url = "";
      }
    } else {
      url = props.add_remote_file_url;
    }
    setInvalid_flag(false);
    evt.stopPropagation();
    const new_file: File = addedFiles[0];
    setFile({ name: new_file.name, status: "uploading" } as FileRef);
    const form_data = new FormData();
    form_data.append("pdf_form", new_file);
    const [_res, err_code] = await nm_ctx.request({
      method: "POST",
      path: url,
      data: form_data,
    });
    if (err_code === 0) {
      setFile({ name: new_file.name, status: "edit" });
    }
  };

  const remove_file = async (_e: any, _content: { uuid: string }) => {
    const [_res, err_code] = await nm_ctx.request({
      method: "DELETE",
      path: props.delete_remote_file_url
        ? props.delete_remote_file_url
        : props.add_remote_file_url
        ? props.add_remote_file_url
        : "",
      show_progress: true,
    });

    if (err_code === 0) {
      setFile(null);
    } else {
      console.log(err_code);
      setInvalid_flag(true);
    }
  };

  return (
    <div style={{ marginBottom: "1em", height: "7em" }}>
      {file ? (
        <FileUploaderItem
          status={file.status}
          name={file.name}
          invalid={invalid_flag}
          onDelete={remove_file}
          style={{ width: "100%", height: "100%" }}
        />
      ) : (
        <FileUploaderDropContainer {...props} onAddFiles={onAddFiles} />
      )}
    </div>
  );
}
