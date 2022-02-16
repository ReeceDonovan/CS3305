import { Button, Link, Tooltip } from "carbon-components-react";

const CopyableLink = (props: { link: string; disabled?: boolean }) => {
  const link = props.link;

  if (props.disabled) {
    return (
      <Link href={link} disabled={true}>
        {link}
      </Link>
    );
  } else {
    return (
      <span>
        <Tooltip
          triggerText={<Link href={link}>{link}</Link>}
          showIcon={false}
          focusTrap={false}
        >
          <Button
            small
            onClick={(e) => {
              e.stopPropagation();
            }}
            style={{ display: "inline", width: "50%" }}
          >
            <Link
              href={link}
              target="_blank"
              style={{
                color: "white",
                textDecoration: "none",
                border: "none",
              }}
            >
              <p>Open</p>
            </Link>
          </Button>
          <Button
            small
            onClick={() => {
              navigator.clipboard.writeText(link).then(() => {});
            }}
            style={{ display: "inline", width: "50%" }}
          >
            <p>Copy</p>
          </Button>
        </Tooltip>
      </span>
    );
  }
};

export default CopyableLink;
