package com.example.demo.controller;

import com.example.demo.model.BlogPost;
import com.example.demo.model.Category;
import com.example.demo.service.BlogPostService;
import com.example.demo.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "http://127.0.0.1:5500") // Cho phép frontend từ localhost:3000
public class BlogPostController {

    @Autowired
    private BlogPostService blogPostService;

    private static final String UPLOAD_DIR = "uploads/";

    @Autowired
    private CategoryService categoryService;

    //API: POST /api/posts/create
    @PostMapping("/create")
    public ResponseEntity<BlogPost> createPost(@RequestParam("title") String title,
                                               @RequestParam("content") String content,
                                               @RequestParam("category") String category,
                                               @RequestParam(value = "image", required = false) MultipartFile image,
                                               @RequestParam(value = "status", required = false) String status) throws IOException {
        // Kiểm tra xem danh mục đã tồn tại chưa
        Category existingCategory = categoryService.findByName(category);
        if (existingCategory == null) {
            // Tạo danh mục mới nếu chưa tồn tại
            existingCategory = new Category();
            existingCategory.setName(category);
            categoryService.save(existingCategory); // Lưu danh mục mới
        }


        BlogPost newPost = new BlogPost();
        newPost.setTitle(title);
        newPost.setContent(content);
        newPost.setCategory(existingCategory);  // Gán đối tượng category
        newPost.setStatus(status != null ? status : "draft"); // Đặt trạng thái cho bài viết

        BlogPost savedPost = blogPostService.savePostWithImage(newPost, image);

        return new ResponseEntity<>(savedPost, HttpStatus.CREATED);
    }



    //API: PUT /api/posts/{id}/update
    @PutMapping("/{id}/update")
    public ResponseEntity<BlogPost> updatePost(@PathVariable Long id,
                                               @RequestParam("title") String title,
                                               @RequestParam("content") String content,
                                               @RequestParam("category") String category,
                                               @RequestParam(value = "image", required = false) MultipartFile image,
                                               @RequestParam(value = "status", required = false) String status) throws IOException {

        BlogPost postToUpdate = blogPostService.getPostById(id);
        if (postToUpdate == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        // Kiểm tra và cập nhật danh mục
        Category existingCategory = categoryService.findByName(category);
        if (existingCategory == null) {
            existingCategory = new Category();
            existingCategory.setName(category);
            categoryService.save(existingCategory);
        }

        postToUpdate.setTitle(title);
        postToUpdate.setContent(content);
        postToUpdate.setCategory(existingCategory);
        postToUpdate.setStatus(status != null ? status : postToUpdate.getStatus());

        BlogPost updatedPost = blogPostService.savePostWithImage(postToUpdate, image);

        return new ResponseEntity<>(updatedPost, HttpStatus.OK);
    }

    //API: DELETE /api/posts/{id}/delete
    @DeleteMapping("/{id}/delete")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        BlogPost postToDelete = blogPostService.getPostById(id);
        if (postToDelete == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        blogPostService.deletePost(id); // Hàm xóa bài viết
        return new ResponseEntity<>(HttpStatus.NO_CONTENT); // Trả về mã trạng thái 204 (No Content) khi xóa thành công
    }



    @GetMapping("/{id}")
    public ResponseEntity<BlogPost> getPost(@PathVariable Long id) {
        BlogPost post = blogPostService.getPostById(id);
        if (post != null) {
            return new ResponseEntity<>(post, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping
    public ResponseEntity<List<BlogPost>> getAllPosts() {
        List<BlogPost> posts = blogPostService.getAllPosts();
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    // API: GET /api/posts/images/{imageName} - Để phục vụ hình ảnh
    @GetMapping("/images/{imageName}")
    @ResponseBody
    public ResponseEntity<byte[]> getImage(@PathVariable String imageName) throws IOException {
        Path imagePath = Paths.get(UPLOAD_DIR + imageName);  // Đọc từ thư mục uploads
        if (Files.exists(imagePath)) {
            byte[] imageBytes = Files.readAllBytes(imagePath);
            return ResponseEntity.ok(imageBytes);  // Trả về ảnh
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // Phương thức để lấy danh sách bài viết đã được xuất bản
    @GetMapping("/published")
    public ResponseEntity<List<BlogPost>> getPublishedPosts(@RequestParam(required = false) Long categoryId) {
        List<BlogPost> posts;

        if (categoryId != null) {
            // Lọc bài viết theo categoryId và trạng thái là "published"
            posts = blogPostService.getPublishedPostsByCategoryId(categoryId);
        } else {
            // Nếu không có categoryId, trả về tất cả bài viết đã xuất bản
            posts = blogPostService.getPublishedPosts();
        }

        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    // Phương thức để xuất bản bài viết
    @PostMapping("/{id}/publish")
    public ResponseEntity<BlogPost> publishPost(@PathVariable Long id) {
       BlogPost post = blogPostService.publishPost(id);
        if (post != null) {
            return ResponseEntity.ok(post);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // Trả về lỗi 404 nếu không tìm thấy bài viết
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<BlogPost>> searchBlogPosts(@RequestParam String keyword) {
        List<BlogPost> blogPosts = blogPostService.searchBlogPosts(keyword);
        if (blogPosts.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(blogPosts, HttpStatus.OK);
    }




}
