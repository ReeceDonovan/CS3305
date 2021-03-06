import {
  CloudServiceManagement16,
  User16,
  UserRole16,
} from "@carbon/icons-react";
import About16 from "@carbon/icons-react/lib/carousel--horizontal/16";
import Home16 from "@carbon/icons-react/lib/home/16";
import Notification20 from "@carbon/icons-react/lib/notification/20";
import User20 from "@carbon/icons-react/lib/user/20";
import {
  Header,
  HeaderContainer,
  HeaderGlobalAction,
  HeaderGlobalBar,
  HeaderMenuButton,
  HeaderName,
  SideNav,
  SideNavDivider,
  SideNavItem,
  SideNavItems,
  SideNavMenuItem,
} from "carbon-components-react/lib/components/UIShell";
import Link from "next/link";
import { useEffect, useState } from "react";
import * as api from "../api";
import { User } from "../api/types";
import styles from "../styles/Head.module.css";

export default function Head() {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    (async () => {
      const user = await api.getToken();
      if (user) {
        setUser(user);
      }
    })();
  }, []);

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
              {user?.role === "COORDINATOR" ? (
                <div>
                  <SideNavDivider />
                  <SideNavItem>
                    <SideNavItems>
                      <SideNavMenuItem
                        className={styles.sideNav}
                        href="/admin/permissions"
                      >
                        <UserRole16 /> &nbsp; <span>User Permissions</span>
                      </SideNavMenuItem>
                    </SideNavItems>
                  </SideNavItem>
                  <SideNavItem>
                    <SideNavItems>
                      <SideNavMenuItem
                        className={styles.sideNav}
                        href="/admin/settings"
                      >
                        <CloudServiceManagement16 /> &nbsp;{" "}
                        <span>Server Settings</span>
                      </SideNavMenuItem>
                    </SideNavItems>
                  </SideNavItem>
                </div>
              ) : null}
            </SideNavItems>
          </SideNav>
        </Header>
      )}
    />
  );
}
