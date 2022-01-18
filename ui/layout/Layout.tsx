import Head from "./Head";
import * as React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
        <Head />
        <main
            id="main"
          style={{
              maxWidth: '100vw',
              margin: '50px 0 0 50px'
          }}
        >
            {children}
        </main>
        </>
    )
}
