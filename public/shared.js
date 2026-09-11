const EINVOICE_CONFIG = {
  APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbwJiwo-Abv8sK2kGDy-XcA7fV0Nx6lN3NSEu9kvxSsdSpR9lv6pZmPFoOd2dquW16i2yw/exec',
  LOCAL_STORAGE_KEY: 'dctb_einvoice_requests_v2',
  LANG_STORAGE: 'dctb_einvoice_lang_v1',
  THEME_STORAGE: 'dctb_einvoice_theme_v1'
};

const I18N = {
  zh: {
    themeLight: '白天',
    themeDark: '暗色',
    customerTitle: 'DCTB e-Invoice Request',
    customerSubtitle: '提交资料后，我们会人工处理并通过 email 发给你。',
    formTitle: 'e-Invoice 资料表',
    formNote: '线上订单和线下门市都可以使用这份表格。',
    sourceSection: '来源',
    onlineOrder: '线上订单',
    offlineStore: '线下门市',
    salesPlatform: '销售平台',
    salesPlatformErr: '请选择销售平台',
    selectOne: '请选择',
    orderNoOptional: '订单号 / Receipt No.',
    optional: '选填',
    outlet: '门市 / Event',
    outletPlaceholder: '例如 HQ Showroom / Mid Valley Booth',
    outletErr: '请填写门市或活动地点',
    receiptNo: 'Receipt No.',
    buyerSection: '买家资料',
    buyerType: '买家类型',
    individual: '个人',
    company: '公司',
    buyerName: '姓名 / 公司名',
    buyerNameErr: '请填写姓名或公司名',
    tinErr: '请填写 TIN',
    idType: '识别号码类型',
    idTypeErr: '请选择识别号码类型',
    idNo: 'IC / BRN / Passport No.',
    idNoErr: '请填写识别号码',
    sstPlaceholder: '没有可填 NA',
    emailErr: '请填写正确 email',
    phone: '电话',
    phoneErr: '电话只接受数字，前面可加 +，8 至 20 位',
    addressSection: '地址',
    addressErr: '请填写地址',
    cityErr: '请填写 city',
    stateErr: '请选择 state',
    postalErr: 'Malaysia postal code 需要 5 位数字',
    countryErr: '请填写 country',
    transactionSection: '交易资料',
    purchaseDate: '购买日期',
    purchaseDateErr: '请选择购买日期',
    totalAmount: '总金额 RM',
    amountErr: '请填写大于 0 的金额',
    itemSummary: '购买项目 / Service',
    itemSummaryPlaceholder: '例如 Kiddo Pad, P900, Heco Vision Pro, subscription renewal',
    itemSummaryErr: '请填写购买项目',
    receiptUpload: '上传 receipt / 付款截图',
    uploadTitle: '点击上传 receipt',
    uploadHint: '支持图片或 PDF，最多 3 个文件。',
    receiptUploadErr: '请至少上传一个 receipt 或付款截图',
    sampleReceiptTitle: 'Receipt / Invoice',
    sampleReceiptText: '清楚看到商家、日期和金额。',
    sampleStoreReceiptTitle: '门市 Receipt',
    sampleStoreReceiptText: '清楚看到 receipt no.、门市、日期和金额。',
    notes: '备注',
    notesPlaceholder: '可填写 delivery note、company branch、extra request',
    consentText: '我确认以上资料正确，并同意 DCTB 使用这些资料处理 e-Invoice。',
    consentErr: '需要确认资料授权',
    submitButton: '提交资料',
    resetButton: '清空表单',
    step1: '提交订单或门市购买资料。',
    step2: '我们核对付款、订单和买家资料。',
    step3: '内部团队登入 MyInvois Portal 手动提交。',
    step4: 'e-Invoice 完成后通过 email 发给你。',
    connectedNoticeCustomer: '<strong>Connected mode:</strong> 资料会提交到内部处理表，完成后会通过 email 通知你。',
    demoNoticeCustomer: '<strong>Demo mode:</strong> 现在会把资料存在这个浏览器。真正给客户用之前，请先连接 Google Apps Script。',
    successMessage: '资料已提交。Request ID: <code>{id}</code>。我们会核对资料后通过 email 发出 e-Invoice。',
    submitLoading: '提交中',
    submitFailed: '提交失败，请检查网络或 Apps Script URL',
    tooManyFiles: '最多只能上传 3 个 receipt 文件',
    fileTooLarge: '文件太大，请上传 5MB 以下的文件'
  },
  en: {
    themeLight: 'Light',
    themeDark: 'Dark',
    customerTitle: 'DCTB e-Invoice Request',
    customerSubtitle: 'Submit your details and we will process the e-Invoice manually by email.',
    formTitle: 'e-Invoice Request Form',
    formNote: 'Use this form for online orders and offline store purchases.',
    sourceSection: 'Source',
    onlineOrder: 'Online order',
    offlineStore: 'Offline store',
    salesPlatform: 'Sales platform',
    salesPlatformErr: 'Please select a sales platform',
    selectOne: 'Select one',
    orderNoOptional: 'Order No. / Receipt No.',
    optional: 'Optional',
    outlet: 'Outlet / Event',
    outletPlaceholder: 'Example: HQ Showroom / Mid Valley Booth',
    outletErr: 'Please enter the outlet or event location',
    receiptNo: 'Receipt No.',
    buyerSection: 'Buyer details',
    buyerType: 'Buyer type',
    individual: 'Individual',
    company: 'Company',
    buyerName: 'Name / Company name',
    buyerNameErr: 'Please enter the name or company name',
    tinErr: 'Please enter TIN',
    idType: 'ID type',
    idTypeErr: 'Please select an ID type',
    idNo: 'IC / BRN / Passport No.',
    idNoErr: 'Please enter the ID number',
    sstPlaceholder: 'Enter NA if not available',
    emailErr: 'Please enter a valid email',
    phone: 'Phone',
    phoneErr: 'Phone must be 8 to 20 digits, with optional + at the front',
    addressSection: 'Address',
    addressErr: 'Please enter address line 1',
    cityErr: 'Please enter city',
    stateErr: 'Please select state',
    postalErr: 'Malaysia postal code must be 5 digits',
    countryErr: 'Please enter country',
    transactionSection: 'Transaction details',
    purchaseDate: 'Purchase date',
    purchaseDateErr: 'Please select the purchase date',
    totalAmount: 'Total amount RM',
    amountErr: 'Please enter an amount greater than 0',
    itemSummary: 'Item / Service',
    itemSummaryPlaceholder: 'Example: Kiddo Pad, P900, Heco Vision Pro, subscription renewal',
    itemSummaryErr: 'Please enter the item or service',
    receiptUpload: 'Upload receipt / payment screenshot',
    uploadTitle: 'Click to upload receipt',
    uploadHint: 'Images or PDF, maximum 3 files.',
    receiptUploadErr: 'Please upload at least one receipt or payment screenshot',
    sampleReceiptTitle: 'Receipt / Invoice',
    sampleReceiptText: 'Make sure the merchant, date, and total amount are clear.',
    sampleStoreReceiptTitle: 'Store receipt',
    sampleStoreReceiptText: 'Make sure the receipt no., outlet, date, and total amount are clear.',
    notes: 'Notes',
    notesPlaceholder: 'Delivery note, company branch, or extra request',
    consentText: 'I confirm the details are correct and allow DCTB to use them for e-Invoice processing.',
    consentErr: 'Please confirm this permission',
    submitButton: 'Submit details',
    resetButton: 'Clear form',
    step1: 'Submit order or store purchase details.',
    step2: 'We check the payment, order, and buyer details.',
    step3: 'Our team submits manually in MyInvois Portal.',
    step4: 'We email the completed e-Invoice to you.',
    connectedNoticeCustomer: '<strong>Connected mode:</strong> Your details will be submitted to the internal processing sheet and sent by email after completion.',
    demoNoticeCustomer: '<strong>Demo mode:</strong> Data is stored only in this browser. Connect Google Apps Script before sharing this with customers.',
    successMessage: 'Your details have been submitted. Request ID: <code>{id}</code>. We will check the information and email the e-Invoice after processing.',
    submitLoading: 'Submitting',
    submitFailed: 'Submission failed. Please check the network or Apps Script URL',
    tooManyFiles: 'You can upload up to 3 receipt files',
    fileTooLarge: 'File is too large. Please upload files under 5MB'
  }
};

function isRemoteConfigured(){
  const url = EINVOICE_CONFIG.APPS_SCRIPT_URL;
  return url && !url.includes('PASTE_YOUR');
}

function currentLang(){
  return localStorage.getItem(EINVOICE_CONFIG.LANG_STORAGE) || 'zh';
}

function t(key){
  const lang = currentLang();
  return (I18N[lang] && I18N[lang][key]) || I18N.zh[key] || key;
}

function initCommon(){
  const savedTheme = localStorage.getItem(EINVOICE_CONFIG.THEME_STORAGE) || 'light';
  document.documentElement.dataset.theme = savedTheme;
  const savedLang = currentLang();
  document.documentElement.lang = savedLang === 'zh' ? 'zh-Hans' : 'en';
  bindCommonControls();
  applyI18n();
  setNoticeForPage();
}

function bindCommonControls(){
  document.querySelectorAll('[data-lang]').forEach(button => {
    button.addEventListener('click', () => {
      localStorage.setItem(EINVOICE_CONFIG.LANG_STORAGE, button.dataset.lang);
      document.documentElement.lang = button.dataset.lang === 'zh' ? 'zh-Hans' : 'en';
      applyI18n();
      setNoticeForPage();
      window.dispatchEvent(new CustomEvent('languagechange'));
    });
  });
  document.querySelectorAll('[data-theme-choice]').forEach(button => {
    button.addEventListener('click', () => {
      localStorage.setItem(EINVOICE_CONFIG.THEME_STORAGE, button.dataset.themeChoice);
      document.documentElement.dataset.theme = button.dataset.themeChoice;
      updateActiveControls();
    });
  });
}

function applyI18n(){
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  updateActiveControls();
}

function updateActiveControls(){
  const lang = currentLang();
  const theme = document.documentElement.dataset.theme || 'light';
  document.querySelectorAll('[data-lang]').forEach(button => {
    button.classList.toggle('active', button.dataset.lang === lang);
  });
  document.querySelectorAll('[data-theme-choice]').forEach(button => {
    button.classList.toggle('active', button.dataset.themeChoice === theme);
  });
}

function setNoticeForPage(){
  const notice = document.getElementById('systemNotice');
  if(!notice) return;
  notice.innerHTML = isRemoteConfigured() ? t('connectedNoticeCustomer') : t('demoNoticeCustomer');
}

function readLocalRequests(){
  try { return JSON.parse(localStorage.getItem(EINVOICE_CONFIG.LOCAL_STORAGE_KEY)) || []; }
  catch(err){ return []; }
}

function saveLocalRequest(record){
  const records = readLocalRequests();
  records.unshift(record);
  localStorage.setItem(EINVOICE_CONFIG.LOCAL_STORAGE_KEY, JSON.stringify(records));
}

function makeRequestId(date){
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2,'0');
  const dd = String(date.getDate()).padStart(2,'0');
  const suffix = Math.random().toString(36).slice(2,6).toUpperCase();
  return `EINV-${yyyy}${mm}${dd}-${suffix}`;
}

function escapeHtml(value){
  return String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}

function toast(message){
  const el = document.getElementById('toast');
  if(!el) return;
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove('show'), 2400);
}
