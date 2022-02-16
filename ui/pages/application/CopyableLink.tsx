import { Button, Link, Tooltip } from "carbon-components-react";

const CopyableLink = (props: { link: string }) => {
  const link = props.link;
  return (
    <span>
      <p>Shareable URL (only to co-authors and supervisors):</p>
      <br />
      <Link href={link}>{link}</Link>
      <Tooltip style={{ padding: "0", margin: "0" }}>
        <Link href={link}>Open in a new Tab</Link>
        <Button
          small
          onClick={() => {
            navigator.clipboard.writeText(`link`).then(() => {});
          }}
        >
          Click to Copy
        </Button>
      </Tooltip>
      <br />
      <Button
        small
        onClick={() => {
          navigator.clipboard.writeText(`link`).then(() => {});
        }}
      >
        Click to Copy
      </Button>
    </span>
  );
};

export default CopyableLink;
