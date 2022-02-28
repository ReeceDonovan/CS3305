import { useContext, useEffect, useState } from "react";
import AppMetadata from "./AppMetadata";
import PDFView from "./PDFView";
import { NetworkManagerContext } from "../NetworkManager";

const StaticApplication = (props: { application: any }) => {
  const [pdf, setPdf] = useState<Blob | undefined>(undefined);
  const { hasFile }: { hasFile: boolean } = props.application;

  const nm_ctx = useContext(NetworkManagerContext);
  useEffect(() => {
    if (hasFile) {
      (async () => {
        const [blob, err_code] = await nm_ctx.fetchFile({
          method: "GET",
          path: `/applications/${props.application.id}/form`,
        });
        if (err_code === 0) {
          setPdf(blob);
        }
      })();
    }
  }, [hasFile]);

  return (
    <div>
      {hasFile ? <PDFView pdf={pdf} /> : <p>No form attached</p>}

      <AppMetadata application={props.application} />
    </div>
  );
};

export default StaticApplication;
