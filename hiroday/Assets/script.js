document.addEventListener("DOMContentLoaded", () => {
  function viewPost(postId) {
    fetch(`http://localhost:8080/api/posts/${postId}`)
      .then((response) => response.json())
      .then((post) => {
        // Định dạng ngày tháng
        const date = new Date(post.date);
        const formattedDate = date.toLocaleDateString("vi-VN", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: false,
        });

        // Tạo phần tử div để chứa chi tiết bài viết
        const postDiv = document.createElement("div");
        postDiv.classList.add("post-detail");

        // Chèn phần nội dung, trong đó dòng cuối cùng được in đậm và nghiêng
        const contentWithLastLine = `
      <h3>${post.title}</h3>
      <p class="date"><strong>Xuất bản:</strong> ${formattedDate}</p> 
      ${
        post.image
          ? `<img src="http://localhost:8080/api/posts/images/${post.image}" alt="Post image" />`
          : ""
      }
      <p class="content">${
        post.content
      }<span class="last-line">Lê Lưu Tuấn Kha.</span></p>
      <p><strong>Danh mục:</strong> ${
        post.category ? post.category.name : "Danh mục trống"
      }</p>
      <p class="status"><strong>Trạng thái:</strong> ${post.status}</p>
    `;

        postDiv.innerHTML = contentWithLastLine;

        // Thêm bài viết chi tiết vào container
        const blogContainer = document.getElementById("blog-container");
        blogContainer.innerHTML = ""; // Xóa các bài viết trước
        blogContainer.appendChild(postDiv); // Hiển thị bài viết chi tiết

        // Cuộn trang lên phần Blog để giữ người dùng ở đúng vị trí
        const blogSection = document.getElementById("blog");
        blogSection.scrollIntoView({ behavior: "smooth", block: "start" });
      })
      .catch((error) => {
        console.error("Error fetching post:", error);
      });
  }
  document.getElementById("search-btn").addEventListener("click", async () => {
    const keyword = document.getElementById("search-input").value.trim();
    if (!keyword) {
      alert("Vui lòng nhập từ khóa!");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/posts/search?keyword=${encodeURIComponent(
          keyword
        )}`
      );
      if (response.status === 204) {
        alert("Không tìm thấy bài viết nào liên quan.");
        return;
      }

      const data = await response.json();
      const resultsContainer = document.getElementById("search-suggestions");
      resultsContainer.innerHTML = "";

      data.forEach((post) => {
        const li = document.createElement("li");
        li.innerHTML = `
                <div class="post-container-search">
        <!-- Cột 1 -->
        <div class="post-column-1-search">
          <h3 class="post-title-search">${post.title}</h3>
          ${
            post.image
              ? `<img src="http://localhost:8080/api/posts/images/${post.image}" alt="Post image" class="post-image-search" />`
              : ""
          }
          <button class="viewPostBtnSearch" data-post-id="${post.id}">
            Đọc
          </button>
        </div>

        <!-- Cột 2 -->
        <div class="post-column-2-search">
          <p class="post-content-search">${post.content.substring(
            0,
            100
          )}...</p>
          <p class="post-category-search"><strong>Danh mục:</strong> ${
            post.category ? post.category.name : "Danh mục trống"
          }</p>
        </div>
      </div>
            `;
        resultsContainer.appendChild(li);

        const viewPostBtnSearch = li.querySelector(".viewPostBtnSearch");
        viewPostBtnSearch.addEventListener("click", function () {
          console.log("View post button clicked", post.id);
          viewPost(post.id); // Gọi hàm xem chi tiết bài viết
        });
      });
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
    }
  });

  document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("blog"); // Gán modal với phần tử DOM có id="modal"

    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
  });

  // Image slider functionality
  const slides = document.querySelectorAll(".slide");
  const prevButton = document.querySelector(".prev");
  const nextButton = document.querySelector(".next");
  let currentSlide = 0;

  const showSlide = (index) => {
    slides.forEach((slide, i) => {
      slide.style.display = i === index ? "block" : "none";
    });
  };

  const nextSlide = () => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  };

  const prevSlide = () => {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
  };

  prevButton.addEventListener("click", prevSlide);
  nextButton.addEventListener("click", nextSlide);

  showSlide(currentSlide);
});

const menuToggle = document.getElementById("menu-toggle");
const menu = document.getElementById("menu");
const closeMenu = document.getElementById("close-menu");
const menuLinks = document.querySelectorAll("nav#menu ul li a");
const socialLinksMobile = document.querySelectorAll(".social-links-mobile a");

// Mở menu khi click vào hamburger
menuToggle.addEventListener("click", () => {
  menu.classList.toggle("show");
});

// Đóng menu khi click vào nút "X"
closeMenu.addEventListener("click", () => {
  menu.classList.remove("show");
});
menuLinks.forEach((link) => {
  link.addEventListener("click", () => {
    menu.classList.remove("show");
  });
});

// Khi nhấn vào các liên kết mạng xã hội trong menu mobile, đóng menu
socialLinksMobile.forEach((link) => {
  link.addEventListener("click", () => {
    menu.classList.remove("show");
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // Biến trạng thái đăng nhập
  let isLoggedIn = false;

  // Lấy các phần tử cần thiết
  const settingsBtn = document.getElementById("login-btn"); // Nút "Cài đặt" (Settings)
  const settingsMenu = document.getElementById("settings-menu");
  const loginModal = document.getElementById("login-modal"); // Modal đăng nhập
  const closeLoginModal = document.getElementById("close-login-modal"); // Nút đóng modal đăng nhập
  const loginForm = document.getElementById("login-form"); // Form đăng nhập
  const loginOption = document.getElementById("login-option");
  const themeOption = document.getElementById("theme-option");
  const prefersDarkScheme = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;
  const blogEditorModal = document.getElementById("blog-editor-modal"); // Modal thêm/xóa bài viết
  const closeEditorModal = document.getElementById("close-editor-modal"); // Nút đóng modal thêm/xóa bài viết
  const blogContainer = document.getElementById("blog-container"); // Phần hiển thị bài viết
  const categorySelect = document.getElementById("categorySelect"); // Select để chọn category
  fetchCategories(); // Lấy danh mục bài viết

  // Xử lý khi người dùng chọn category từ dropdown
  categorySelect.addEventListener("change", function () {
    const categoryId = this.value;
    fetchPosts(categoryId); // Gọi lại hàm fetchPosts với categoryId
  });

  // Xử lý khi người dùng chọn chế độ nền
  themeOption.addEventListener("click", function () {
    if (document.body.classList.contains("dark-mode")) {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    } else {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    }
  });

  // Chế độ nền mặc định (dựa trên hệ thống hoặc localStorage)
  const currentMode = localStorage.getItem("theme");
  if (currentMode) {
    document.body.classList.add(currentMode);
  } else if (prefersDarkScheme) {
    document.body.classList.add("dark-mode");
  }

  // Mở menu khi nhấn vào nút cài đặt
  settingsBtn.addEventListener("click", function () {
    settingsMenu.style.display =
      settingsMenu.style.display === "block" ? "none" : "block";
  });

  // Đóng menu khi nhấn vào bất kỳ đâu ngoài menu
  window.addEventListener("click", function (event) {
    if (
      !settingsBtn.contains(event.target) &&
      !settingsMenu.contains(event.target)
    ) {
      settingsMenu.style.display = "none";
    }
  });

  // Mở modal đăng nhập khi nhấn vào "Đăng nhập"
  loginOption.addEventListener("click", function () {
    settingsMenu.style.display = "none";
    loginModal.style.display = "flex";
  });

  // Đóng modal đăng nhập
  closeLoginModal.addEventListener("click", function () {
    loginModal.style.display = "none";
  });

  // Xử lý form đăng nhập
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Kiểm tra thông tin đăng nhập (ở đây là kiểm tra đơn giản)
    if (username === "admin" && password === "admin123") {
      isLoggedIn = true;
      alert("Đăng nhập thành công!");

      // Đóng modal đăng nhập
      loginModal.style.display = "none";

      // Hiển thị form thêm/xóa bài viết (chỉ khi đăng nhập thành công)
      blogEditorModal.style.display = "flex";

      fetchPosts(); // Tải bài viết ra trang chủ
    } else {
      alert("Thông tin đăng nhập không chính xác!");
    }
  });

  // Đóng modal thêm/xóa bài viết khi nhấn vào nút đóng
  closeEditorModal.addEventListener("click", function () {
    blogEditorModal.style.display = "none"; // Ẩn form thêm/xóa bài viết khi nhấn đóng
  });

  // Tự động ẩn form thêm/xóa bài viết nếu chưa đăng nhập
  if (!isLoggedIn) {
    blogEditorModal.style.display = "none"; // Đảm bảo form thêm/xóa bài viết không hiển thị
  }

  // Lấy phần tử logo
  const logo = document.getElementById("logo");

  // Thêm sự kiện click vào logo
  logo.addEventListener("click", function (event) {
    event.preventDefault(); // Ngăn chặn hành động mặc định (chuyển trang nếu logo là link)
    window.scrollTo(0, 0);

    // Gọi hàm fetchPosts để tải lại danh sách bài viết
    fetchPosts(); // Đây là hàm đã được định nghĩa để lấy bài viết và hiển thị lên trang

    // Nếu bạn muốn ẩn chi tiết bài viết khi nhấn vào logo, bạn có thể thêm dòng này:
    const blogContainer = document.getElementById("blog-container");
    blogContainer.innerHTML = ""; // Xóa tất cả chi tiết bài viết hiện tại (nếu có)

    // Nếu có modal chi tiết bài viết đang mở, đóng nó đi
    const postDetail = document.querySelector(".post-detail");
    if (postDetail) {
      postDetail.style.display = "none"; // Ẩn modal chi tiết bài viết
    }
  });

  // Lấy phần tử "Blog" trong menu
  const blogLink = document.querySelector('a[href="#blog"]');

  // Lấy phần tử chứa nội dung blog (mục Blog)
  const blogSection = document.getElementById("blog");

  // Thêm sự kiện click vào liên kết Blog trong menu
  blogLink.addEventListener("click", function (event) {
    event.preventDefault(); // Ngăn chặn hành động mặc định (chuyển trang)

    // Cuộn trang đến mục Blog
    blogSection.scrollIntoView({ behavior: "smooth", block: "start" });

    // Gọi hàm fetchPosts để tải lại danh sách bài viết
    fetchPosts();
  });
  // Hàm để cập nhật thời gian hiện tại
  function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleString(); // Lấy thời gian hiện tại ở định dạng địa phương
    return "Cập nhật vào: " + timeString;
  }
  // Lấy danh sách bài viết từ backend và hiển thị
  function fetchPosts(categoryId = null) {
    let url = "http://localhost:8080/api/posts/published";
    if (categoryId) {
      url += `?categoryId=${categoryId}`;
    }

    fetch(url) // Địa chỉ API backend để lấy danh sách bài viết
      .then((response) => response.json())
      .then((posts) => {
        // Xóa các slide cũ (nếu cần thiết)
        const slidesContainer = document.querySelector(".slides");

        // Xóa các slide hiện có trong container
        slidesContainer.innerHTML = "";

        // Clear existing posts
        blogContainer.innerHTML = "";

        posts.forEach((post) => {
          // Chuyển đổi ngày đăng thành định dạng dễ đọc
          const postDate = new Date(post.date);
          const formattedDate = postDate.toLocaleDateString("vi-VN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: false,
          });

          // Tạo một slide mới cho mỗi bài viết
          const slideDiv = document.createElement("div");
          slideDiv.classList.add("slide");
          slideDiv.innerHTML = `
          <img src="http://localhost:8080/api/posts/images/${
            post.image
          }" alt="${post.title}" />
          <div class="slide-text">
            <h3>${post.title}</h3>
            <div class="update-time">${updateTime()}</div>
            <div class="author">Tác giả: Lê Lưu Tuấn Kha</div>
            <button class="viewPostBtnSlide" data-post-id="${post.id}">
        Tìm hiểu về Bài viết
      </button>
          </div>
        `;

          // Thêm slide vào container
          slidesContainer.appendChild(slideDiv);

          const postDiv = document.createElement("div");
          postDiv.classList.add("post");
          postDiv.innerHTML = `
  <div class="post-container">
    <!-- Danh mục nằm ở trên cùng -->
    <h5 class="post-category">Danh mục: ${
      post.category ? post.category.name : "Danh mục trống"
    }</h5>
    
    <!-- Tiêu đề ở giữa -->
    <h2 class="post-title">${post.title}</h2>
    
    <!-- Thời gian -->
    <p class="post-date">Xuất bản: ${formattedDate}</p>

    <!-- Div chứa 2 cột -->
    <div class="post-body">
      <!-- Cột bên trái: hình ảnh -->
      <div class="post-image">
        ${
          post.image
            ? `<img src="http://localhost:8080/api/posts/images/${post.image}" alt="${post.title}" />`
            : `<img src="../Img/1imagedefault.png" alt="Default image" />`
        }
      </div>
      
      <!-- Cột bên phải: content và nút -->
      <div class="post-content">
        <p>${post.content.substring(0, 200)}...</p>
        <div class="actions">
          <button class="viewPostBtn" data-post-id="${post.id}">Đọc</button>
          ${
            isLoggedIn
              ? `
              <button class="deletePostBtn" data-post-id="${post.id}">Xóa</button>
              <button class="publishPostBtn" data-post-id="${post.id}">Đăng bài</button>
              `
              : ""
          }
        </div>
      </div>
    </div>

    <!-- Trạng thái -->
    <p class="post-status"><strong>Trạng thái:</strong> ${post.status}</p>
  </div>
`;

          // Tìm nút "Tìm hiểu về Bài viết" và thêm sự kiện click
          const viewPostBtnSlide = slideDiv.querySelector(".viewPostBtnSlide");
          viewPostBtnSlide.addEventListener("click", function () {
            viewPost(post.id); // Gọi hàm xem chi tiết bài viết
          });
          // Check if the buttons exist before adding event listeners
          const viewPostBtn = postDiv.querySelector(".viewPostBtn");
          if (viewPostBtn) {
            viewPostBtn.addEventListener("click", function () {
              viewPost(post.id);
            });
          }
          const editPostBtn = postDiv.querySelector(".editPostBtn");
          const deletePostBtn = postDiv.querySelector(".deletePostBtn");
          const publishPostBtn = postDiv.querySelector(".publishPostBtn");

          // Add event listeners only if buttons exist

          if (editPostBtn) {
            editPostBtn.addEventListener("click", function () {
              editPost(post.id);
            });
          }

          if (deletePostBtn) {
            deletePostBtn.addEventListener("click", function () {
              deletePost(post.id);
            });
          }

          if (publishPostBtn) {
            publishPostBtn.addEventListener("click", function () {
              publishPost(post.id);
            });
          }

          // Append the post to the container
          blogContainer.appendChild(postDiv);
        });
      })
      .catch((error) => console.error("Error fetching posts:", error));
  }

  // Hàm lấy danh sách category và hiển thị vào select
  function fetchCategories() {
    fetch("http://localhost:8080/api/categories")
      .then((response) => response.json())
      .then((categories) => {
        categories.forEach((category) => {
          const option = document.createElement("option");
          option.value = category.id;
          option.textContent = category.name;
          categorySelect.appendChild(option);
        });
      })
      .catch((error) => console.error("Error fetching categories:", error));
  }

  // Hàm xem chi tiết bài viết
  function viewPost(postId) {
    fetch(`http://localhost:8080/api/posts/${postId}`)
      .then((response) => response.json())
      .then((post) => {
        // Định dạng ngày tháng
        const date = new Date(post.date);
        const formattedDate = date.toLocaleDateString("vi-VN", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: false,
        });

        // Tạo phần tử div để chứa chi tiết bài viết
        const postDiv = document.createElement("div");
        postDiv.classList.add("post-detail");

        // Chèn phần nội dung, trong đó dòng cuối cùng được in đậm và nghiêng
        const contentWithLastLine = `
      <h3>${post.title}</h3>
      <p class="date"><strong>Xuất bản:</strong> ${formattedDate}</p> 
      ${
        post.image
          ? `<img src="http://localhost:8080/api/posts/images/${post.image}" alt="Post image" />`
          : ""
      }
      <p class="content">${
        post.content
      }<span class="last-line">Lê Lưu Tuấn Kha.</span></p>
      <p><strong>Danh mục:</strong> ${
        post.category ? post.category.name : "Danh mục trống"
      }</p>
      <p class="status"><strong>Trạng thái:</strong> ${post.status}</p>
    `;

        postDiv.innerHTML = contentWithLastLine;

        // Thêm bài viết chi tiết vào container
        const blogContainer = document.getElementById("blog-container");
        blogContainer.innerHTML = ""; // Xóa các bài viết trước
        blogContainer.appendChild(postDiv); // Hiển thị bài viết chi tiết

        // Cuộn trang lên phần Blog để giữ người dùng ở đúng vị trí
        const blogSection = document.getElementById("blog");
        blogSection.scrollIntoView({ behavior: "smooth", block: "start" });
      })
      .catch((error) => {
        console.error("Error fetching post:", error);
      });
  }

  // Hàm xóa bài viết
  function deletePost(postId) {
    if (confirm("Bạn có chắc muốn xóa bài viết?")) {
      fetch(`http://localhost:8080/api/posts/${postId}/delete`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            alert("Xóa bài viết thành công!");
            fetchPosts(); // Cập nhật lại danh sách bài viết
          } else {
            alert("Xóa bài viết không thành công!");
          }
        })
        .catch((error) => console.error("Lỗi khi xóa bài viết:", error));
    }
  }

  // Hàm hiển thị bài viết ra trang chính
  function publishPost(postId) {
    fetch(`http://localhost:8080/api/posts/${postId}/publish`, {
      method: "POST",
    })
      .then((response) => {
        if (response.ok) {
          alert("Đăng bài thành công!");
          fetchPosts(); // Cập nhật lại danh sách bài viết
        } else {
          alert("Lỗi khi đăng bài");
        }
      })
      .catch((error) => console.error("Đăng bài lỗi:", error));
  }

  // Xử lý tạo bài viết mới từ form
  document.getElementById("blogForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", document.getElementById("title").value);
    formData.append("content", tinymce.get("content").getContent());
    formData.append("category", document.getElementById("category").value);
    formData.append("status", document.getElementById("status").value);
    formData.append("image", document.getElementById("image").files[0]);

    // Gửi dữ liệu tạo bài viết
    fetch("http://localhost:8080/api/posts/create", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        alert("Bài viết đã được tạo thành công!");
        blogEditorModal.style.display = "none"; // Đóng modal tạo bài viết
        fetchPosts(); // Cập nhật danh sách bài viết
      })
      .catch((error) => {
        console.error("Lỗi khi tạo bài viết:", error);
      });
  });

  document
    .getElementById("categorySelect")
    .addEventListener("change", function () {
      const categoryId = this.value;
      fetchPosts(categoryId); // Gọi lại hàm fetchPosts với categoryId
    });

  // Gọi hàm fetchPosts() khi trang đã tải xong để hiển thị các bài viết đã xuất bản
  fetchPosts();
});

// JavaScript để toggle danh sách kỹ năng
function toggleSkillList(skillId) {
  const skillList = document.getElementById(skillId);
  skillList.classList.toggle("open");
}

function sendMail() {
  let parms = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    subject: document.getElementById("subject").value,
    message: document.getElementById("message").value,
  };

  emailjs
    .send("service_rpg9neh", "template_01ekofa", parms)
    .then(alert("Gửi thành công!"));
}

let currentSlideIndex = 0; // Chỉ số của slide hiện tại

// Hàm chuyển sang slide tiếp theo
function nextSlide() {
  const slides = document.querySelectorAll(".slide");
  if (currentSlideIndex < slides.length - 1) {
    currentSlideIndex++;
  } else {
    currentSlideIndex = 0; // Quay lại slide đầu tiên khi đạt đến cuối
  }
  updateSlidePosition();
}

// Hàm quay lại slide trước
function prevSlide() {
  const slides = document.querySelectorAll(".slide");
  if (currentSlideIndex > 0) {
    currentSlideIndex--;
  } else {
    currentSlideIndex = slides.length - 1; // Quay lại slide cuối cùng khi quay lại đầu
  }
  updateSlidePosition();
}

// Hàm cập nhật vị trí của các slide
function updateSlidePosition() {
  const slides = document.querySelectorAll(".slide");
  slides.forEach((slide, index) => {
    if (index === currentSlideIndex) {
      slide.style.display = "block"; // Hiển thị slide hiện tại
    } else {
      slide.style.display = "none"; // Ẩn các slide còn lại
    }
  });
}

// Cập nhật vị trí ban đầu của các slide khi trang được tải
document.addEventListener("DOMContentLoaded", function () {
  updateSlidePosition();
});

// Hàm để thay đổi chiều dài của nội dung post.content
function updatePostContent() {
  const postContentElements = document.querySelectorAll(".post-content p");

  postContentElements.forEach((element) => {
    const fullContent = element.textContent; // Lấy toàn bộ nội dung
    let contentToShow = fullContent;

    if (window.innerWidth <= 768) {
      contentToShow = fullContent.substring(0, 100); // Lấy 100 ký tự cho màn hình dưới 768px
    } else if (window.innerWidth <= 480) {
      contentToShow = fullContent.substring(0, 100); // Lấy 100 ký tự cho màn hình dưới 480px
    } else {
      contentToShow = fullContent.substring(0, 200); // Lấy 200 ký tự cho màn hình lớn hơn 768px
    }

    element.textContent = contentToShow;
  });
}

// Gọi hàm khi trang tải và khi thay đổi kích thước cửa sổ
window.addEventListener("load", updatePostContent);
window.addEventListener("resize", updatePostContent);
