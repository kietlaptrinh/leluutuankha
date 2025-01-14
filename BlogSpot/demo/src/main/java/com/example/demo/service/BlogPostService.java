package com.example.demo.service;

import com.example.demo.model.BlogPost;
import com.example.demo.model.Category;
import com.example.demo.repository.BlogPostRepository;
import com.example.demo.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BlogPostService {

    @Autowired
    private BlogPostRepository blogPostRepository;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private CategoryRepository categoryRepository;

    private static String UPLOAD_DIR = "uploads/";

    public BlogPost savePostWithImage(BlogPost post, MultipartFile image) throws IOException {
        // Gán trạng thái mặc định là "draft" nếu không có trạng thái
        if (post.getStatus() == null) {
            post.setStatus("draft");
        }

        // Kiểm tra và tạo thư mục uploads nếu chưa tồn tại
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);  // Tạo thư mục nếu không tồn tại
        }

        // Xử lý hình ảnh nếu có
        if (image != null && !image.isEmpty()) {
            String imageName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
            Path imagePath = uploadPath.resolve(imageName);  // Tạo đường dẫn đầy đủ cho file ảnh

            // Lưu ảnh vào thư mục uploads
            Files.copy(image.getInputStream(), imagePath);

            // Lưu tên ảnh vào bài viết
            post.setImage(imageName);
        }

        // Lưu bài viết vào cơ sở dữ liệu
        return blogPostRepository.save(post);
    }

    // Xóa bài viết
    public void deletePost(Long id) {
        BlogPost post = blogPostRepository.findById(id).orElse(null);
        if (post != null) {
            Category category = post.getCategory();
        blogPostRepository.deleteById(id);

            // Kiểm tra xem danh mục có còn bài viết nào không
            if (category != null && category.getPosts().isEmpty()) {
                categoryRepository.delete(category); // Nếu không còn bài viết, xóa danh mục
            }
        }
    }

    // Lấy bài viết theo ID
    public BlogPost getPostById(Long id) {
        return blogPostRepository.findById(id).orElse(null);
    }

    public List<BlogPost> getAllPosts() {
        return blogPostRepository.findAll();
    }

    public BlogPost publishPost(Long id) {
        BlogPost post = blogPostRepository.findById(id).orElse(null);
        if (post != null) {
            post.setStatus("published");  // Đổi trạng thái thành "published"
            return blogPostRepository.save(post); // Lưu lại bài viết đã được xuất bản
        }
        return null; // Trả về null nếu bài viết không tìm thấy
    }

    // Lấy tất cả bài viết đã được xuất bản
    public List<BlogPost> getPublishedPosts() {
        return blogPostRepository.findByStatus("published");
    }

    // Lấy bài viết đã xuất bản theo categoryId
    public List<BlogPost> getPublishedPostsByCategoryId(Long categoryId) {
        return blogPostRepository.findByCategoryIdAndStatus(categoryId, "published");
    }

    public List<BlogPost> searchBlogPosts(String keyword) {
        // Tìm kiếm với các trường hỗ trợ trong truy vấn JPQL
        List<BlogPost> posts = blogPostRepository.searchBlogPostsWithoutContent(keyword);

        // Lọc thêm trên trường "content" trong Java
        return posts.stream()
                .filter(post -> post.getContent() != null &&
                        post.getContent().toLowerCase().contains(keyword.toLowerCase()))
                .collect(Collectors.toList());
    }

}
