"use client";

import { ApolloProvider } from "@apollo/client";
import client from "../lib/apollo-client";
import { Provider } from "react-redux";
import { store, persistor } from "@/store";
import { PersistGate } from "redux-persist/integration/react";
import { useEffect, useState } from "react";

// Detect Safari
const isSafari = typeof window !== 'undefined' && 
  /^((?!chrome|android).)*safari/i.test(navigator.userAgent) &&
  !navigator.userAgent.includes('Chrome');

export default function ApolloWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // For Safari, don't block rendering on persist rehydration
    // This prevents navigation issues where first click goes to home
    if (isSafari) {
      setIsReady(true);
    }
  }, []);

  return (
    <Provider store={store}>
      <PersistGate 
        loading={null} 
        persistor={persistor}
        // For Safari: don't block on rehydration to prevent navigation issues
        {...(isSafari && { 
          onBeforeLift: () => {
            // Allow immediate rendering in Safari
            return Promise.resolve();
          }
        })}
      >
        <ApolloProvider client={client}>{children}</ApolloProvider>
      </PersistGate>
    </Provider>
  );
}
