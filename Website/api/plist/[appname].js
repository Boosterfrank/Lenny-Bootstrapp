import fetch from 'node-fetch';

export default async function handler(req, res) {
  const {
    query: { appname }
  } = req;

  console.log("Requested plist for app:", appname);

  const jsonUrl = 'https://raw.githubusercontent.com/Boosterfrank/Lenny-Bootstrapp/refs/heads/main/Rocket%20App%20Source.json';

  try {
    const response = await fetch(jsonUrl);
    if (!response.ok) {
      console.error("Failed to fetch JSON:", response.statusText);
      return res.status(500).send('Error fetching app data.');
    }

    const data = await response.json();

    const app = data.apps.find(a =>
      a.name.toLowerCase().replace(/\s+/g, '') === appname.toLowerCase()
    );

    if (!app) {
      console.warn("App not found in JSON for:", appname);
      return res.status(404).send('App not found');
    }

    const plist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
"http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>items</key>
  <array>
    <dict>
      <key>assets</key>
      <array>
        <dict>
          <key>kind</key>
          <string>software-package</string>
          <key>url</key>
          <string>${app.versions[0].downloadURL}</string>
        </dict>
        <dict>
          <key>kind</key>
          <string>display-image</string>
          <key>url</key>
          <string>${app.iconURL}</string>
        </dict>
        <dict>
          <key>kind</key>
          <string>full-size-image</string>
          <key>url</key>
          <string>${app.iconURL}</string>
        </dict>
      </array>
      <key>metadata</key>
      <dict>
        <key>bundle-identifier</key>
        <string>${app.bundleIdentifier}</string>
        <key>bundle-version</key>
        <string>${app.versions[0].version}</string>
        <key>kind</key>
        <string>software</string>
        <key>title</key>
        <string>${app.name}</string>
      </dict>
    </dict>
  </array>
</dict>
</plist>`;

    res.setHeader('Content-Type', 'application/xml');
    res.status(200).send(plist);
  } catch (err) {
    console.error("Unhandled error:", err);
    res.status(500).send('Internal server error');
  }
}
