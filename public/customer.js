const MAX_RECEIPT_FILES = 3;
const MAX_FILE_BYTES = 5 * 1024 * 1024;
const MAX_IMAGE_DIM = 1600;
const JPEG_QUALITY = 0.72;

let receiptFiles = [];

const form = document.getElementById('einvoiceForm');
const submitBtn = document.getElementById('submitBtn');
const successBox = document.getElementById('successBox');
const receiptDropzone = document.getElementById('receiptDropzone');
const receiptInput = document.getElementById('receiptInput');
const receiptList = document.getElementById('receiptList');

function initCustomer(){
  initCommon();
  bindCustomerEvents();
  updateChannelBlocks();
}

function bindCustomerEvents(){
  document.querySelectorAll('input[name="channel"]').forEach(input => {
    input.addEventListener('change', updateChannelBlocks);
  });
  form.addEventListener('submit', submitRequest);
  document.getElementById('resetFormBtn').addEventListener('click', () => {
    form.reset();
    receiptFiles = [];
    renderReceiptFiles();
    updateChannelBlocks();
    clearErrors();
  });

  receiptDropzone.addEventListener('click', () => receiptInput.click());
  receiptDropzone.addEventListener('keydown', event => {
    if(event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      receiptInput.click();
    }
  });
  receiptInput.addEventListener('change', event => {
    handleReceiptFiles(event.target.files);
    receiptInput.value = '';
  });
  ['dragover','dragenter'].forEach(type => {
    receiptDropzone.addEventListener(type, event => {
      event.preventDefault();
      receiptDropzone.classList.add('drag');
    });
  });
  ['dragleave','drop'].forEach(type => {
    receiptDropzone.addEventListener(type, event => {
      event.preventDefault();
      receiptDropzone.classList.remove('drag');
    });
  });
  receiptDropzone.addEventListener('drop', event => handleReceiptFiles(event.dataTransfer.files));

  window.addEventListener('languagechange', () => {
    renderReceiptFiles();
    if(successBox.classList.contains('show') && successBox.dataset.requestId) {
      showSuccess({requestId: successBox.dataset.requestId});
    }
  });
}

function updateChannelBlocks(){
  const channel = form.elements.channel.value;
  document.getElementById('onlineBlock').classList.toggle('active', channel === 'Online');
  document.getElementById('offlineBlock').classList.toggle('active', channel === 'Offline');
}

async function handleReceiptFiles(fileList){
  const incoming = Array.from(fileList || []);
  for(const file of incoming){
    if(receiptFiles.length >= MAX_RECEIPT_FILES){
      toast(t('tooManyFiles'));
      break;
    }
    if(file.size > MAX_FILE_BYTES){
      toast(t('fileTooLarge'));
      continue;
    }
    const converted = await prepareReceiptFile(file);
    receiptFiles.push(converted);
  }
  renderReceiptFiles();
}

async function prepareReceiptFile(file){
  if(file.type.startsWith('image/')){
    const compressed = await compressImage(file);
    return {
      name: file.name.replace(/\.[^.]+$/, '') + '.jpg',
      mimeType: 'image/jpeg',
      size: compressed.size,
      base64: compressed.base64
    };
  }
  const base64 = await readFileAsDataUrl(file);
  return {
    name: file.name,
    mimeType: file.type || 'application/octet-stream',
    size: file.size,
    base64
  };
}

function compressImage(file){
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        let width = image.width;
        let height = image.height;
        if(width > MAX_IMAGE_DIM || height > MAX_IMAGE_DIM){
          if(width > height){
            height = Math.round(height * MAX_IMAGE_DIM / width);
            width = MAX_IMAGE_DIM;
          } else {
            width = Math.round(width * MAX_IMAGE_DIM / height);
            height = MAX_IMAGE_DIM;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(image, 0, 0, width, height);
        const base64 = canvas.toDataURL('image/jpeg', JPEG_QUALITY);
        resolve({base64, size: Math.round((base64.length * 3) / 4)});
      };
      image.onerror = reject;
      image.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function readFileAsDataUrl(file){
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function renderReceiptFiles(){
  if(!receiptFiles.length){
    receiptList.innerHTML = '';
    return;
  }
  receiptList.innerHTML = receiptFiles.map((file, index) => `
    <div class="file-row">
      <span>${escapeHtml(file.name)} <span class="muted">(${formatBytes(file.size)})</span></span>
      <button type="button" data-index="${index}" aria-label="Remove file">x</button>
    </div>
  `).join('');
  receiptList.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
      receiptFiles.splice(Number(button.dataset.index), 1);
      renderReceiptFiles();
    });
  });
}

function buildPayload(){
  const fd = new FormData(form);
  const channel = fd.get('channel');
  const now = new Date();
  return {
    requestId: makeRequestId(now),
    submittedAt: now.toISOString(),
    channel,
    source: channel === 'Online' ? fd.get('onlinePlatform').trim() : fd.get('outlet').trim(),
    receiptNo: channel === 'Online' ? fd.get('orderNo').trim() : fd.get('receiptNo').trim(),
    receiptFiles,
    receiptLinks: receiptFiles.map(file => file.name),
    buyerType: fd.get('buyerType'),
    buyerName: fd.get('buyerName').trim(),
    tin: fd.get('tin').trim().toUpperCase(),
    idType: fd.get('idType'),
    idNo: fd.get('idNo').trim(),
    sstNo: (fd.get('sstNo') || '').trim() || 'NA',
    email: fd.get('email').trim(),
    phone: fd.get('phone').trim(),
    address1: fd.get('address1').trim(),
    address2: fd.get('address2').trim(),
    city: fd.get('city').trim(),
    state: fd.get('state'),
    postalCode: fd.get('postalCode').trim(),
    country: fd.get('country').trim() || 'Malaysia',
    purchaseDate: fd.get('purchaseDate'),
    amount: Number(fd.get('amount')),
    itemSummary: fd.get('itemSummary').trim(),
    customerNote: fd.get('customerNote').trim(),
    status: 'New',
    assignedTo: '',
    internalNotes: '',
    myinvoisDocNo: '',
    myinvoisUuid: '',
    validationLink: '',
    pdfLink: '',
    lastUpdated: now.toISOString(),
    emailSentAt: ''
  };
}

function validateForm(){
  clearErrors();
  const fd = new FormData(form);
  const channel = fd.get('channel');
  let ok = true;
  const required = [
    ['f-buyerName', fd.get('buyerName').trim()],
    ['f-tin', fd.get('tin').trim()],
    ['f-idType', fd.get('idType')],
    ['f-idNo', fd.get('idNo').trim()],
    ['f-address1', fd.get('address1').trim()],
    ['f-city', fd.get('city').trim()],
    ['f-state', fd.get('state')],
    ['f-postal', fd.get('postalCode').trim()],
    ['f-country', fd.get('country').trim()],
    ['f-purchaseDate', fd.get('purchaseDate')],
    ['f-itemSummary', fd.get('itemSummary').trim()]
  ];
  if(channel === 'Online'){
    required.push(['f-onlinePlatform', fd.get('onlinePlatform')]);
  } else {
    required.push(['f-outlet', fd.get('outlet').trim()]);
  }
  required.forEach(([id, value]) => {
    if(!value){ setError(id); ok = false; }
  });

  const email = fd.get('email').trim();
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ setError('f-email'); ok = false; }

  const phone = fd.get('phone').trim();
  if(!/^\+?\d{8,20}$/.test(phone)){ setError('f-phone'); ok = false; }

  const country = fd.get('country').trim().toLowerCase();
  const postal = fd.get('postalCode').trim();
  if(country === 'malaysia' && !/^\d{5}$/.test(postal)){ setError('f-postal'); ok = false; }

  const amount = Number(fd.get('amount'));
  if(!Number.isFinite(amount) || amount <= 0){ setError('f-amount'); ok = false; }

  if(!receiptFiles.length){ setError('f-upload'); ok = false; }

  if(!fd.get('consent')){ setError('f-consent'); ok = false; }
  return ok;
}

function setError(id){
  const el = document.getElementById(id);
  if(el) el.classList.add('invalid');
}

function clearErrors(){
  document.querySelectorAll('.field.invalid').forEach(el => el.classList.remove('invalid'));
}

async function submitRequest(event){
  event.preventDefault();
  successBox.classList.remove('show');
  if(!validateForm()) return;

  const payload = buildPayload();
  submitBtn.disabled = true;
  submitBtn.textContent = t('submitLoading');
  try {
    if(isRemoteConfigured()){
      await fetch(EINVOICE_CONFIG.APPS_SCRIPT_URL, {
        method:'POST',
        mode:'no-cors',
        headers:{'Content-Type':'text/plain;charset=utf-8'},
        body:JSON.stringify({action:'create', data:payload})
      });
    } else {
      const localPayload = {
        ...payload,
        receiptFiles: [],
        receiptLinks: receiptFiles.map(file => file.name)
      };
      saveLocalRequest(localPayload);
    }
    form.reset();
    receiptFiles = [];
    renderReceiptFiles();
    updateChannelBlocks();
    showSuccess(payload);
  } catch(err) {
    toast(t('submitFailed'));
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = t('submitButton');
  }
}

function showSuccess(payload){
  successBox.dataset.requestId = payload.requestId;
  successBox.innerHTML = t('successMessage').replace('{id}', escapeHtml(payload.requestId));
  successBox.classList.add('show');
  window.scrollTo({top:0,behavior:'smooth'});
}

function formatBytes(bytes){
  if(!bytes) return '0 KB';
  if(bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

initCustomer();
