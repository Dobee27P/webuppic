// Danh sách người dùng mẫu (trong thực tế nên lưu trữ an toàn trên máy chủ)
const users = [
    { username: "admin", password: "admin123" },
    { username: "user", password: "user123" }
];

// Kiểm tra nếu người dùng đã đăng nhập
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
        // Nếu đã đăng nhập, chuyển hướng đến trang chính
        window.location.href = 'index.html';
    }
}

// Xử lý đăng nhập
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');
    
    // Kiểm tra thông tin đăng nhập
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        // Lưu trạng thái đăng nhập
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', username);
        
        // Chuyển hướng đến trang chính
        window.location.href = 'index.html';
    } else {
        // Hiển thị thông báo lỗi
        errorMessage.style.display = 'block';
    }
}

// Xử lý đăng ký (hiện tại chỉ là mẫu)
function handleRegister(event) {
    event.preventDefault();
    alert('Chức năng đăng ký sẽ được phát triển trong tương lai!');
}

// Khởi tạo trang
document.addEventListener('DOMContentLoaded', function() {
    // Kiểm tra đăng nhập
    checkLoginStatus();
    
    // Xử lý sự kiện đăng nhập
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Xử lý sự kiện đăng ký
    const registerLink = document.getElementById('register-link');
    if (registerLink) {
        registerLink.addEventListener('click', handleRegister);
    }
});