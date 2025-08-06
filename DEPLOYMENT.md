# 🚀 デプロイメントガイド

## ✅ デプロイ前チェックリスト

### 1. 環境設定
- [ ] `.env.example`を参考に環境変数を設定
- [ ] Gemini APIキーを取得・設定
- [ ] 本番環境のドメイン/URLを確認

### 2. コード品質
- [ ] `npm run build`が成功することを確認
- [ ] `npm run dev`で動作確認
- [ ] 全機能のテスト（ファイルアップロード、コード入力、レビュー生成）
- [ ] レスポンシブデザインの確認

### 3. セキュリティ
- [ ] 環境変数にAPIキーが正しく設定されている
- [ ] CORS設定が適切
- [ ] レート制限が有効
- [ ] 機密情報がリポジトリに含まれていない

## 🌐 Vercelデプロイ手順

### Step 1: Vercelアカウント設定
1. [Vercel](https://vercel.com)でアカウント作成
2. GitHubアカウントを連携

### Step 2: プロジェクト作成
1. 「New Project」をクリック
2. GitHubリポジトリをインポート
3. ビルド設定は自動検出：
   ```
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   Development Command: npm run dev
   ```

### Step 3: 環境変数設定
Vercel管理画面 > Project Settings > Environment Variables で以下を設定：

```bash
GEMINI_API_KEY=your_actual_gemini_api_key  # Production, Preview, Development
MAX_REQUESTS_PER_HOUR=50                   # Production, Preview, Development
NODE_ENV=production                        # Production
```

### Step 4: デプロイ実行
1. GitHubにプッシュで自動デプロイ開始
2. デプロイログを確認
3. 生成されたURLでアクセステスト

### Step 5: カスタムドメイン設定（オプション）
1. Project Settings > Domains
2. カスタムドメインを追加
3. DNS設定を更新（CNAME: cname.vercel-dns.com）
4. SSL証明書は自動設定

## 🔧 トラブルシューティング

### ビルドエラー
```bash
# 依存関係の再インストール
rm -rf node_modules package-lock.json
npm install

# キャッシュクリア
npm run build --force
```

### 環境変数エラー
- Netlify管理画面で環境変数が正しく設定されているか確認
- APIキーが有効かテスト
- レート制限の値が数値型か確認

### 関数エラー
- `netlify/functions/`ディレクトリの構造確認
- Node.jsのバージョン互換性確認（Node 18推奨）
- 依存関係が正しくインストールされているか確認

### パフォーマンス最適化
```bash
# バンドルサイズ分析
npm run build -- --analyze

# 動的インポートでコード分割
# components/LazyComponent.jsx
const LazyComponent = lazy(() => import('./Component'))
```

## 📊 モニタリング設定

### アナリティクス
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
```

### エラートラッキング
```bash
# Sentry設定例
npm install @sentry/react
```

### パフォーマンス監視
- Lighthouse CI設定済み
- Core Web Vitalsの監視
- Netlify Analyticsの有効化

## 🔄 継続的デプロイ

### 自動デプロイ
- mainブランチへのプッシュで自動デプロイ
- プルリクエストでプレビュー環境作成
- GitHub Actionsでテスト自動実行

### デプロイコマンド
```bash
# 本番デプロイ
git push origin main

# 開発ブランチのプレビュー
git push origin feature/new-feature
```

## 📚 参考リンク

- [Netlify Documentation](https://docs.netlify.com/)
- [Vite Build Guide](https://vitejs.dev/guide/build.html)
- [Google Gemini API](https://ai.google.dev/)
- [React Deployment](https://react.dev/learn/start-a-new-react-project#deploying-to-production)

---

**みんなでハッピーなデプロイを実現しましょうっピ！** 🚀✨