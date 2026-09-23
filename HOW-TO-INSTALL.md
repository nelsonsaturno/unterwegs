# Unterwegs – Deutsch A2 → B1 (offline)

A German course for offline use: 10 units, 200 words and about 1,000 audio clips.
Everything runs locally. Once it is set up, you don't need an internet connection.

## Laptop (the simplest option)

1. Unzip `unterwegs.zip`.
2. Double-click **`index.html`**. Use Chrome, Edge or Firefox; Safari also works, but it may not save your progress when you open the file directly.
3. That's all. You don't need a server or an internet connection.

## iPhone / iPad (install once while online, then use it offline)

iOS only keeps a web app offline if the app was loaded over HTTPS once. So you host the folder somewhere once, for free, and then add it to your home screen.

### Step 1: Host the folder (about 5 minutes, free)

**Option A: GitHub Pages** (the folder has about 1,000 files, so push it with git instead of the web uploader)

```bash
cd unterwegs            # the unzipped folder
git init -b main && git add . && git commit -m "Unterwegs"
gh repo create unterwegs --public --source=. --push
# or: git remote add origin git@github.com:<you>/unterwegs.git && git push -u origin main
```

Then in the repository, go to **Settings → Pages → Build and deployment**, choose **Deploy from a branch** and select `main` / `(root)`.
After about a minute the course is available at `https://<you>.github.io/unterwegs/`.

**Option B: Netlify Drop.** Open app.netlify.com/drop, sign in with a free account and drag the unzipped folder onto the page.

(Every page and text in the course is original material, so a public repository is fine.)

### Step 2: Install on the iPhone

1. Open the URL in **Safari**. Use Wi-Fi.
2. Tap **Share → Add to Home Screen** ("Zum Home-Bildschirm").
3. Open **Unterwegs from the home screen**. This matters because the home-screen app has its own storage.
4. A banner shows the download progress: *"Audio wird … gespeichert … 45 %"*. Keep the app open until it says **"Offline bereit"** (about 15 MB).
5. Test it: switch on Airplane Mode, close the app and open it again. Play a few audio clips.

## Translations (everything works offline)

- **Tap any sentence** to open a panel with its English translation. Tap an underlined word in the panel to see what that word means.
- **Highlight words or a whole passage**, then tap **Übersetzen**. The panel shows the meaning of each selected word and the translation of every sentence you touched.
- **"Englisch zeigen"** puts the English under every sentence, question, task and grammar explanation. You'll find this switch in Lesen, Grammatik, Üben, Schreiben and Sprechen, and it applies everywhere at once. The Hören tab has its own "+ Englisch" switch.
- After you press **Prüfen**, each exercise answer also shows its translation.

## Updating an installed copy

Unzip the new version over your repository folder, then run:

```bash
git add -A && git commit -m "Update" && git push
```

Open the app once while you're online. It installs the update and reloads itself. The audio files you already downloaded are kept.

## Moving your progress between devices

Go to **Einstellungen → Fortschritt → Exportieren** on one device and **Importieren** on the other.

## What's inside

| | |
|---|---|
| Units | 10 (A2 → B1), set in everyday Swiss situations that match fide topics |
| Each unit | Vocabulary with audio · dialogue with comprehension questions · grammar · 5–6 interactive exercises (choice, gap fill, sentence building, matching, dictation) · reading · writing task with a model answer · speaking practice with timer, recording and model answers |
| Flashcards | All 200 words, reviewed with a Leitner schedule (the Karteikarten tab) |
| Audio | Synthetic neural voices (Piper TTS: Thorsten and Kerstin). The playback speed is adjustable (0.75× / 0.9× / 1×) |
| Translations | English for all 1,200+ sentences and a glossary of about 2,100 word forms. All of it is built in and works offline |
| Spelling | Swiss Standard German (ss instead of ß; Velo, Billett, Spital …) |
