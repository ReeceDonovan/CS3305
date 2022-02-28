import { InlineLoading } from "carbon-components-react";

const PDFView = (props: { pdf?: Blob; style?: any }) => {
  const pdf = props.pdf;
  if (!pdf)
    return <InlineLoading description={`awaiting loading of ${"form.pdf"}`} />;

  return (
    <>
      <iframe
        src={URL.createObjectURL(new Blob([pdf], { type: "application/pdf" }))}
        style={{
          height: "calc(100vh - 4em)",
          margin: "auto",
          position: "relative",
          width: "1300px",
          float: "right",
        }}
      />
    </>
  );
};

export default PDFView;
