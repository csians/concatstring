"use client";

import { ApolloProvider } from "@apollo/client";
import client from "../lib/apollo-client";
import { Provider } from "react-redux";
import { store, persistor } from "@/store";
import { PersistGate } from "redux-persist/integration/react";

export default function ApolloWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ApolloProvider client={client}>{children}</ApolloProvider>
      </PersistGate>
    </Provider>
  );
}
