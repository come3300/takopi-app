# 🐙 タコピーAIコードレビューっピ！

「タコピーの冤罪」のタコピーの口調でコードレビューを行うWebアプリケーションです。ファイルアップロードまたはテキスト入力でコードを受け取り、優しく建設的なAIレビューを返します。

## ✨ 特徴

- 🌟 **タコピーらしい優しいレビュー**: 語尾に「っピ」を付けた愛情深いフィードバック
- 📁 **複数ファイル対応**: ドラッグ&ドロップでの簡単アップロード
- 🎨 **シンタックスハイライト**: 30以上のプログラミング言語をサポート
- ⚙️ **カスタマイズ可能**: レビューレベルとフォーカス領域を調整可能
- 💖 **癒し相談室**: コードレビューで凹んだ時にタコピーが優しく励ましてくれる
- 📱 **レスポンシブデザイン**: モバイルからデスクトップまで対応
- 🔒 **セキュア**: プライベート情報は保存せず、セッションベースで動作

## 🚀 技術スタック

### フロントエンド
- **React 18**: モダンなReactフック使用
- **Tailwind CSS**: ユーティリティファーストCSS
- **Vite**: 高速な開発サーバーとビルドツール

### バックエンド
- **Vercel Functions**: サーバーレス関数
- **Google Gemini API**: メインのAIエンジン

### 主要ライブラリ
- `react-dropzone`: ファイルドラッグ&ドロップ
- `react-markdown`: Markdownレンダリング
- `react-syntax-highlighter`: コードハイライト
- `@google/generative-ai`: Gemini AI統合

## 📦 セットアップ

### 1. リポジトリのクローン
```bash
git clone https://github.com/your-username/tacopii-code-reviewer.git
cd tacopii-code-reviewer
```

### 2. 依存関係のインストール
```bash
npm install
```

### 3. 環境変数の設定

#### 3.1 環境変数ファイルの作成
```bash
cp .env.example .env
```

#### 3.2 Google Gemini APIキーの取得

**必須ステップ**: タコピーのAIレビュー機能を使用するには、Google Gemini APIキーが必要ですっピ！

1. **Google AI Studioにアクセス**
   - [Google AI Studio](https://makersuite.google.com/app/apikey) にアクセス
   - Googleアカウントでログイン

2. **APIキーの作成**
   ```
   1. 「Create API Key」をクリック
   2. 既存のGoogle Cloudプロジェクトを選択 または 新しいプロジェクトを作成
   3. APIキーが生成されるので、コピーして保存
   ```

3. **APIキーの制限設定（推奨）**
   ```
   - Application restrictions: HTTPリファラーを設定
   - API restrictions: Gemini APIのみに制限
   - Usage quotas: 1日の使用量制限を設定
   ```

#### 3.3 .envファイルの編集

`.env`ファイルを開いて以下のように設定：

```env
# 🔑 必須: Google Gemini APIキー
# Google AI Studioで取得したAPIキーを設定してくださいっピ
GEMINI_API_KEY=AIzaSyD_your_actual_gemini_api_key_here

# ⏰ オプション: レート制限設定（1時間あたりのリクエスト数）
# デフォルト値: 50回/時間
MAX_REQUESTS_PER_HOUR=50

# 🌍 環境設定
NODE_ENV=development
```

#### 3.4 環境変数の検証

設定が正しいかチェックする方法：

```bash
# 1. .envファイルの内容確認
cat .env

# 2. APIキーの形式確認（AIzaSyで始まる文字列であることを確認）
# ✅ 正しい形式: AIzaSyD1234567890abcdefghijklmnopqrstuvwxyz
# ❌ 間違い: your_gemini_api_key_here

# 3. 開発サーバー起動テスト
npm run dev
```

#### 3.5 セキュリティ注意事項

⚠️ **重要な注意点**:

- **APIキーは絶対に公開しない**: GitHubなどにプッシュしない
- **`.env`ファイルは`.gitignore`に含まれている**: リポジトリにコミットされません
- **本番環境では環境変数として設定**: Netlifyの管理画面で設定

```bash
# ❌ これはダメっピ！
git add .env
git commit -m "Add environment variables"

# ✅ 正しい方法
# .envファイルはgitignoreされているので、自動的に除外されます
```

#### 3.6 よくあるエラーと解決方法

**エラー1: "API key not configured"**
```bash
# 原因: GEMINI_API_KEYが設定されていない
# 解決: .envファイルでAPIキーを正しく設定

# 確認コマンド
echo $GEMINI_API_KEY  # 空の場合は未設定
```

**エラー2: "Invalid API key"**
```bash
# 原因: APIキーの形式が間違っている
# 解決: Google AI Studioで新しいAPIキーを生成

# 正しい形式: AIzaSy... (39文字)
```

**エラー3: "Quota exceeded"**
```bash
# 原因: APIの使用量制限に達した
# 解決: Google Cloud Consoleで制限を確認・調整
```

### 4. 開発サーバーの起動
```bash
npm run dev
```

### 5. ビルドとプレビュー
```bash
npm run build
npm run preview
```

## 🌐 デプロイ

### Vercelへのデプロイ

#### ステップ1: リポジトリをGitHubにプッシュ
```bash
git add .
git commit -m "Initial commit: Tacopii Code Reviewer"
git push origin main
```

#### ステップ2: Vercelでプロジェクトを作成
1. [Vercel](https://vercel.com)でアカウントを作成
2. "New Project"を選択
3. GitHubアカウントを連携
4. リポジトリをインポート

#### ステップ3: ビルド設定
Vercelは自動的に以下を検出します：

```text
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Development Command: npm run dev
```

#### ステップ4: 環境変数の設定（重要！）

**Vercel管理画面での設定方法**:

1. **プロジェクト管理画面にアクセス**
   ```
   Project Settings → Environment Variables
   ```

2. **環境変数を追加**
   
   | Name | Value | Environment | 説明 |
   |------|-------|-------------|------|
   | `GEMINI_API_KEY` | `AIzaSyD_your_actual_api_key` | Production, Preview, Development | ⭐ **必須** Google Gemini APIキー |
   | `MAX_REQUESTS_PER_HOUR` | `50` | Production, Preview, Development | 1時間あたりのリクエスト制限 |
   | `NODE_ENV` | `production` | Production | 本番環境設定 |

3. **Vercel CLIを使用した設定**:
   ```bash
   # Vercel CLIのインストール
   npm install -g vercel
   
   # ログイン
   vercel login
   
   # 環境変数の設定
   vercel env add GEMINI_API_KEY
   # → "AIzaSyD_your_actual_api_key" を入力
   # → Production, Preview, Development を選択
   
   vercel env add MAX_REQUESTS_PER_HOUR
   # → "50" を入力
   
   vercel env add NODE_ENV
   # → "production" を入力
   # → Production のみを選択
   ```

4. **環境変数の確認**:
   ```bash
   # Vercel CLIで確認
   vercel env ls
   
   # または管理画面で「Environment Variables」セクションを確認
   ```

#### ステップ5: デプロイとテスト

1. **初回デプロイ実行**
   ```bash
   # GitHubにプッシュすると自動デプロイ
   git push origin main
   
   # または手動デプロイ
   vercel --prod
   ```

2. **デプロイ状況の確認**
   - Vercelの管理画面で「Deployments」タブを確認
   - ビルドログでエラーがないかチェック

3. **動作テスト**
   ```bash
   # ヘルスチェックエンドポイントをテスト
   curl https://your-project-name.vercel.app/api/health-check
   
   # 期待される応答:
   # {"success":true,"status":"healthy","message":"タコピーのサービスは正常に動作していますっピ！"}
   ```

#### 🚨 デプロイでよくあるエラーと解決方法

**エラー1: "Build failed"**
```bash
# 原因: 依存関係の問題
# 解決方法: package.jsonの確認
npm install  # ローカルで動作確認
npm run build  # ビルドテスト
```

**エラー2: "Serverless Function Error"**
```bash
# 原因: 環境変数未設定
# 解決方法: GEMINI_API_KEYが設定されているか確認
# Vercel管理画面 → Project Settings → Environment Variables
```

**エラー3: "API key not configured"**
```bash
# 原因: 環境変数の値が間違っている
# 解決方法:
# 1. APIキーが正しい形式か確認（AIzaSy...）
# 2. Google AI Studioで新しいキーを生成
# 3. Vercelで再設定後、再デプロイ
```

**エラー4: "Function Timeout"**
```bash
# 原因: Serverless Functionのタイムアウト
# 解決方法: vercel.jsonでmaxDurationを調整済み（30秒）
# Proプラン以上では最大60秒まで設定可能
```

#### 🔒 セキュリティのベストプラクティス

1. **APIキー管理**:
   ```bash
   # ✅ 正しい: Vercelの環境変数で管理
   GEMINI_API_KEY=AIzaSy... (Vercel管理画面で設定)
   
   # ❌ 間違い: コードに直接記載
   const API_KEY = "AIzaSy..." // 絶対にダメ！
   ```

2. **ドメイン制限設定**:
   ```text
   Google Cloud Console → APIs & Services → Credentials
   → API Key → Restrict key
   → HTTP referrers: https://your-project-name.vercel.app/*
   ```

3. **使用量監視**:
   ```text
   Google Cloud Console → Quotas
   → Generative AI API quotas を監視
   ```

#### ⚙️ Vercel固有の設定

**カスタムドメイン設定**:
```bash
# Vercel CLIでカスタムドメインを追加
vercel domains add your-domain.com

# DNS設定（CNAMEレコード）
# your-domain.com → cname.vercel-dns.com
```

**プレビューデプロイメント**:
- プルリクエスト毎に自動でプレビューURL生成
- ブランチ毎のデプロイURL: `https://your-project-name-git-branch-username.vercel.app`

### 📋 環境変数クイックリファレンス

| 変数名 | 必須 | デフォルト | 説明 |
|--------|------|-----------|------|
| `GEMINI_API_KEY` | ✅ | なし | Google Gemini APIキー（[取得方法](#32-google-gemini-apiキーの取得)） |
| `MAX_REQUESTS_PER_HOUR` | ❌ | `50` | 1時間あたりのリクエスト制限 |
| `NODE_ENV` | ❌ | `development` | 実行環境 (`production`/`development`) |

### ⚡ クイックスタートチェックリスト

環境変数の設定で迷った時は、この手順に従ってくださいっピ：

- [ ] 1. `.env.example`をコピーして`.env`ファイルを作成
- [ ] 2. [Google AI Studio](https://makersuite.google.com/app/apikey)でAPIキーを取得
- [ ] 3. `.env`ファイルに`GEMINI_API_KEY=your_api_key`を設定
- [ ] 4. `npm run dev`で動作確認
- [ ] 5. Vercelデプロイ時は管理画面で同じ環境変数を設定

**トラブルシューティング用コマンド**:
```bash
# 環境変数の確認
cat .env | grep GEMINI_API_KEY

# APIキー形式の確認（AIzaSyで始まることを確認）
echo $GEMINI_API_KEY | head -c 6  # 出力: AIzaSy

# アプリケーションの動作確認  
npm run dev
```

## 📚 使い方

### 🌟 コードレビュー機能

1. **コードの入力**
   - ファイルをドラッグ&ドロップするか、直接コードエディタに入力

2. **設定の調整**
   - レビューレベル (1-5段階)
   - フォーカス領域 (セキュリティ、パフォーマンスなど)

3. **レビューの実行**
   - 「レビュー開始っピ！」ボタンをクリック

4. **結果の確認**
   - タコピーの優しいフィードバックを確認
   - Markdownファイルとしてダウンロード可能

### 💖 癒し相談室機能

1. **相談室へのアクセス**
   - ヘッダーの「💖 相談室」をクリック
   - または「💖 癒しが欲しい時は」ボタンをクリック

2. **タコピーに相談**
   - チャット形式でタコピーに相談内容を入力
   - コードレビューで凹んだ時やプログラミングで悩んだ時など

3. **優しい励まし**
   - タコピーが必ず肯定的で温かい励ましをしてくれる
   - どんな内容でも批判せず、ハッピーにしてくれる

4. **会話履歴**
   - 同一セッション内で会話履歴が保持される
   - 「🆕 新しい相談」で履歴をリセット可能

### 対応ファイル形式

- **プログラミング言語**: JavaScript, TypeScript, Python, Java, C++, Go, Rust, PHP, Ruby, Swift, Kotlin, Dart
- **マークアップ**: HTML, CSS, SCSS, Vue.js
- **データ形式**: JSON, XML, YAML
- **その他**: Markdown, プレーンテキスト

## 🛠️ 開発

### プロジェクト構造

```
tacopii-code-reviewer/
├── src/
│   ├── components/          # Reactコンポーネント
│   │   ├── Layout/         # レイアウト関連
│   │   ├── FileUploader.jsx # ファイルアップロード
│   │   ├── CodeEditor.jsx  # コードエディタ
│   │   ├── ReviewDisplay.jsx # レビュー表示
│   │   └── ...
│   ├── pages/              # ページコンポーネント
│   │   ├── HomePage.jsx    # メインのコードレビュー画面
│   │   └── ConsultationPage.jsx # 癒し相談室
│   ├── hooks/              # カスタムフック
│   │   ├── useAIReview.js  # AIレビュー処理
│   │   ├── useConsultation.js # 相談機能
│   │   ├── useFileProcessor.js # ファイル処理
│   │   └── useLocalStorage.js  # ローカルストレージ
│   ├── utils/              # ユーティリティ関数
│   │   ├── languageDetector.js # 言語検出
│   │   ├── fileParser.js   # ファイル解析
│   │   ├── tacopiiPrompt.js # プロンプト生成
│   │   └── constants.js    # 定数定義
│   └── ...
├── api/                    # Vercel Functions（サーバーレス関数）
│   ├── generate-review.js  # レビュー生成API
│   ├── consultation.js     # 相談API
│   └── health-check.js     # ヘルスチェック
├── vercel.json            # Vercel設定ファイル
└── ...
```

### 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# プレビュー
npm run preview

# リント (設定されている場合)
npm run lint

# テスト (設定されている場合)  
npm run test
```

### コントリビューション

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. Pull Requestを作成

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。詳細は[LICENSE](LICENSE)ファイルを参照してください。

## 🤝 クレジット

- **タコピーキャラクター**: 「タコピーの冤罪」（作者：タイザン5）
- **AI技術**: Google Gemini API
- **アイコンとイラスト**: 絵文字 (Unicode Consortium)

## 📞 サポート

問題や質問がある場合は、以下の方法でお問い合わせください：

- **GitHub Issues**: バグ報告や機能リクエスト
- **Discussions**: 一般的な質問や議論

---

**みんながハッピーになるコードを書きましょうっピ！** 🐙✨