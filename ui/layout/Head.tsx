import {
  Header,
  HeaderName,
  HeaderContainer,
  HeaderMenuButton,
  HeaderGlobalBar,
  HeaderGlobalAction,
  SideNav,
  SideNavItems,
  SideNavItem,
  SideNavMenuItem,
} from "carbon-components-react/lib/components/UIShell";
import styles from "../styles/Head.module.css";
import Notification20 from "@carbon/icons-react/lib/notification/20";
import User20 from "@carbon/icons-react/lib/user/20";
import Home16 from "@carbon/icons-react/lib/home/16";
import About16 from "@carbon/icons-react/lib/carousel--horizontal/16";
import { DocumentPdf16, User16 } from "@carbon/icons-react";
import Link from "next/link";

export default function Head() {
  return (
    <HeaderContainer
      render={({ isSideNavExpanded, onClickSideNavExpand }) => (
        <Header
          style={{
            maxWidth: "100vw",
          }}
          aria-label="UCC SRES"
        >
          {/* <SkipToContent /> */}
          <HeaderMenuButton
            isCollapsible
            aria-label="Open menu"
            onClick={onClickSideNavExpand}
            isActive={isSideNavExpanded}
          />
          <HeaderName href="/" prefix="UCC">
            SREC
          </HeaderName>
          <HeaderGlobalBar>
            <HeaderGlobalAction aria-label="Notifications">
              <Notification20 />
            </HeaderGlobalAction>
            <Link href="/account" passHref>
              <a>
                <HeaderGlobalAction
                  style={{ marginRight: "1em" }}
                  aria-label="Account"
                >
                  <User20 />
                </HeaderGlobalAction>
              </a>
            </Link>
          </HeaderGlobalBar>
          <SideNav
            aria-label="Side navigation"
            isRail
            expanded={isSideNavExpanded}
            onOverlayClick={onClickSideNavExpand}
          >
            <SideNavItems>
              <SideNavItem>
                <SideNavItems>
                  <SideNavMenuItem className={styles.sideNav} href="/">
                    <Home16 /> &nbsp; <span>Home</span>
                  </SideNavMenuItem>
                </SideNavItems>
              </SideNavItem>
              <SideNavItem>
                <SideNavItems>
                  <SideNavMenuItem
                    className={styles.sideNav}
                    href="/application/new"
                  >
                    <DocumentPdf16 /> &nbsp; <span>Submit Application</span>
                  </SideNavMenuItem>
                </SideNavItems>
              </SideNavItem>
              <SideNavItem>
                <SideNavItems>
                  <SideNavMenuItem className={styles.sideNav} href="/about">
                    <About16 /> &nbsp; <span>About</span>
                  </SideNavMenuItem>
                </SideNavItems>
              </SideNavItem>
              <SideNavItem>
                <SideNavItems>
                  <SideNavMenuItem className={styles.sideNav} href="/account">
                    <User16 /> &nbsp; <span>Account</span>
                  </SideNavMenuItem>
                </SideNavItems>
              </SideNavItem>
            </SideNavItems>
          </SideNav>
        </Header>
      )}
    />
  );
}
