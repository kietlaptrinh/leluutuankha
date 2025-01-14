package com.example.demo.controller;

import com.example.demo.model.Category;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private CategoryService categoryService;

    @GetMapping("/api/categories")
    public List<Category> getCategories() {
        return categoryRepository.findAll(); // Trả về tất cả các danh mục
    }

    // API: DELETE /api/categories/{id}/delete
    @DeleteMapping("/api/categories/{id}/delete")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        Category category = categoryService.getCategoryById(id);
        if (category == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        // Kiểm tra xem danh mục có bài viết nào không
        if (category.getPosts().isEmpty()) {
            // Nếu không còn bài viết, xóa danh mục
            categoryService.deleteCategory(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        // Nếu có bài viết, không xóa được danh mục
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }
}
