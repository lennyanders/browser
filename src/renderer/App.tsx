import { AddressBar } from './components/AddressBar';

export const App = () => {
  return (
    <>
      <AddressBar />

      <div class="webpage">
        {/* @ts-ignore */}
        <webview class="webpage__view" src="https://lenny.fyi"></webview>
      </div>
    </>
  );
};
