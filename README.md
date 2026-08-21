# DCTB E-Invoice Request

客户扫收据上的 QR → 打开表单 → 填开票资料 → 存进 Supabase，员工在 `/admin` 查看并标记已开票。

## 1. Supabase 设置

1. 建一个新 project（或用你现有的）
2. SQL Editor 里跑 `supabase_schema.sql`
3. Settings → API，拿到 `Project URL` 和 `anon public key`

## 2. 本地跑起来

```bash
npm install
cp .env.example .env
# 填入 VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY / VITE_ADMIN_PASSWORD
npm run dev
```

## 3. 部署到 Vercel

跟你现有项目一样：push 到 GitHub → 在 Vercel import → 在 Vercel 的 Environment Variables 里填入
`VITE_SUPABASE_URL`、`VITE_SUPABASE_ANON_KEY`、`VITE_ADMIN_PASSWORD` 三个值。

## 4. SQL POS 收据模板：QR 公式

在模板设计器里加一个 QR/Barcode 字段，内容用公式拼成：

```
https://你的域名/e/request?store=C1&receipt=<收据号码字段>&amount=<总金额字段>
```

- `store` 每家店的模板里写死各自的代号（C1 / C2 / C3），不用公式
- `receipt`、`amount` 用 SQL POS 里对应的标准字段抓
- 金额建议保留两位小数（e.g. `168.00`），跟表单显示格式一致

三家店各自的模板改一次这个 QR 公式就行，之后不用再管。

## 5. 员工查看后台

打开 `/admin`，输入 `VITE_ADMIN_PASSWORD` 设的密码即可看到所有门店的开票请求，
可以按门店筛选、标记「已开票」。

⚠️ 目前 `/admin` 只是前端密码门槛，方便先跑起来；数据表本身没有对 anon key 开放
读取权限（见 `supabase_schema.sql` 里的说明），所以现在 `/admin` 实际上读不到数据。
等你要正式启用后台查看功能时，跟我说一声，我加一个 Vercel Serverless Function
用 service_role key 读取，这样密码门槛才是真的把关，不会有人绕过前端直接用
anon key 拉全部客户资料。

## 6. 之后可以做的

- 提交成功后自动发邮件通知客人 / 通知你们内部群组
- 接入实际 LHDN MyInvois（如果之后决定不完全依赖 SQL Accounting 的模块）
- 把 `/admin` 换成 Clerk + Google OAuth（跟 dashboard.dctb.my 一样的模式）
# dctb-einvoice
