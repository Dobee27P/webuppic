// Lưu trữ dữ liệu
let imageStorage = {
    default: [] // Thư mục mặc định
};
let currentFolder = "default";
let currentUser = "";

// Kiểm tra đăng nhập
function checkLogin() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
        // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
        window.location.href = 'login.html';
        return false;
    }
    
    // Lấy thông tin người dùng hiện tại
    currentUser = localStorage.getItem('currentUser') || "Khách";
    document.getElementById('user-display').textContent = `Xin chào, ${currentUser}!`;
    
    return true;
}

// Đăng xuất
function logout() {
    // Xóa trạng thái đăng nhập
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    
    // Chuyển hướng đến trang đăng nhập
    window.location.href = 'login.html';
}

// Kiểm tra và tải dữ liệu từ localStorage
function loadFromLocalStorage() {
    // Kiểm tra người dùng đã đăng nhập chưa
    if (!checkLogin()) return;
    
    // Đặt tiền tố cho người dùng để lưu trữ dữ liệu riêng biệt
    const userPrefix = 'imageStorage_' + currentUser;
    
    const savedData = localStorage.getItem(userPrefix);
    if (savedData) {
        imageStorage = JSON.parse(savedData);
    } else {
        // Khởi tạo dữ liệu mặc định cho người dùng mới
        imageStorage = { default: [] };
    }
    
    renderFolders();
    switchFolder(currentFolder);
    updateDeleteFolderButton();
}

// Lưu dữ liệu vào localStorage
function saveToLocalStorage() {
    // Đặt tiền tố cho người dùng để lưu trữ dữ liệu riêng biệt
    const userPrefix = 'imageStorage_' + currentUser;
    localStorage.setItem(userPrefix, JSON.stringify(imageStorage));
}

// Tạo thư mục mới
function createFolder() {
    const folderNameInput = document.getElementById('new-folder');
    const folderName = folderNameInput.value.trim();
    
    if (folderName && !imageStorage[folderName]) {
        imageStorage[folderName] = [];
        saveToLocalStorage();
        renderFolders();
        folderNameInput.value = '';
        
        // Chuyển đến thư mục mới tạo
        switchFolder(folderName);
    } else if (imageStorage[folderName]) {
        alert('Thư mục đã tồn tại!');
    } else {
        alert('Vui lòng nhập tên thư mục!');
    }
}

// Xóa thư mục hiện tại
function deleteFolder() {
    // Không cho phép xóa thư mục mặc định
    if (currentFolder === "default") {
        alert("Không thể xóa thư mục mặc định!");
        return;
    }
    
    if (confirm(`Bạn có chắc muốn xóa thư mục "${currentFolder}" và tất cả ảnh bên trong?`)) {
        // Xóa thư mục khỏi object lưu trữ
        delete imageStorage[currentFolder];
        
        // Lưu thay đổi vào localStorage
        saveToLocalStorage();
        
        // Chuyển về thư mục mặc định
        currentFolder = "default";
        
        // Cập nhật giao diện
        renderFolders();
        switchFolder("default");
    }
}

// Cập nhật trạng thái nút xóa thư mục
function updateDeleteFolderButton() {
    const deleteButton = document.getElementById('delete-folder-btn');
    if (deleteButton) {
        if (currentFolder === "default") {
            deleteButton.disabled = true;
            deleteButton.title = "Không thể xóa thư mục mặc định";
        } else {
            deleteButton.disabled = false;
            deleteButton.title = "Xóa thư mục hiện tại";
        }
    }
}

// Hiển thị danh sách thư mục
function renderFolders() {
    const folderList = document.getElementById('folder-list');
    if (!folderList) return;
    
    folderList.innerHTML = '';
    
    for (const folder in imageStorage) {
        const folderElement = document.createElement('div');
        folderElement.className = `folder ${folder === currentFolder ? 'active' : ''}`;
        folderElement.textContent = folder;
        folderElement.dataset.folder = folder;
        folderElement.onclick = () => switchFolder(folder);
        folderList.appendChild(folderElement);
    }
    
    updateDeleteFolderButton();
}

// Chuyển đổi giữa các thư mục
function switchFolder(folderName) {
    if (imageStorage[folderName]) {
        currentFolder = folderName;
        
        // Cập nhật trạng thái active
        const folders = document.querySelectorAll('.folder');
        folders.forEach(folder => {
            folder.classList.toggle('active', folder.dataset.folder === folderName);
        });
        
        updateDeleteFolderButton();
        renderGallery();
    }
}

// Tải ảnh lên
function uploadImages() {
    const fileInput = document.getElementById('image-upload');
    const files = fileInput.files;
    
    if (files.length === 0) {
        alert('Vui lòng chọn ít nhất một ảnh!');
        return;
    }
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const imageData = {
                id: Date.now() + '-' + i,
                name: file.name,
                src: e.target.result,
                date: new Date().toLocaleString()
            };
            
            imageStorage[currentFolder].push(imageData);
            saveToLocalStorage();
            renderGallery();
        };
        
        reader.readAsDataURL(file);
    }
    
    // Reset input sau khi tải lên
    fileInput.value = '';
}

// Hiển thị thư viện ảnh
function renderGallery() {
    const gallery = document.getElementById('image-gallery');
    if (!gallery) return;
    
    gallery.innerHTML = '';
    
    if (!imageStorage[currentFolder] || imageStorage[currentFolder].length === 0) {
        gallery.innerHTML = '<p>Chưa có ảnh nào trong thư mục này.</p>';
        return;
    }
    
    imageStorage[currentFolder].forEach(image => {
        const card = document.createElement('div');
        card.className = 'image-card';
        card.innerHTML = `
            <div class="image-container">
                <img src="${image.src}" alt="${image.name}">
            </div>
            <div class="image-info">
                <div>${image.name}</div>
                <small>${image.date}</small>
            </div>
            <div class="image-actions">
                <button class="delete-btn" onclick="deleteImage('${image.id}')">Xóa</button>
            </div>
        `;
        gallery.appendChild(card);
    });
}

// Xóa ảnh
function deleteImage(imageId) {
    if (confirm('Bạn có chắc muốn xóa ảnh này?')) {
        imageStorage[currentFolder] = imageStorage[currentFolder].filter(image => image.id !== imageId);
        saveToLocalStorage();
        renderGallery();
    }
}

// Khởi tạo ứng dụng khi trang tải xong
window.onload = function() {
    // Kiểm tra đăng nhập trước khi tải dữ liệu
    loadFromLocalStorage();
    
    // Thiết lập nút đăng xuất
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
};