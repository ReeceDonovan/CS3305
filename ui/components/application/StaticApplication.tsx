import { useContext, useEffect, useState } from "react";
import AppMetadata from "../../pages/application/AppMetadata";
import PDFView from "../../pages/application/PDFView";
import { NetworkManagerContext } from "../NetworkManager";

const StaticApplication = (props: { application: any }) => {
  const [pdf, setPdf] = useState<Blob | undefined>(undefined);

  const nm_ctx = useContext(NetworkManagerContext);
  useEffect(() => {
    (async () => {
      const [blob, err_code] = await nm_ctx.fetchFile({
        method: "GET",
        path: `/applications/${props.application.id}/form`,
      });
      if (err_code === 0) {
        setPdf(blob);
      }
    })();
  }, []);

  return (
    <div>
      <PDFView pdf={pdf} />
      <AppMetadata application={props.application} />
    </div>
  );
};

export default StaticApplication;
