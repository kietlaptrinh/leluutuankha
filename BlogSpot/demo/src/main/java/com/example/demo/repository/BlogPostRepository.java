package com.example.demo.repository;

import com.example.demo.model.BlogPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BlogPostRepository extends JpaRepository<BlogPost, Long> {
    @Query("SELECT bp FROM BlogPost bp JOIN FETCH bp.category WHERE bp.status = :status")
    List<BlogPost> findByStatus(@Param("status") String status);

    List<BlogPost> findByCategoryIdAndStatus(Long categoryId, String status);

    @Query("SELECT b FROM BlogPost b WHERE " +
            "(LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(b.category.name) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND b.status = 'PUBLISHED'")
    List<BlogPost> searchBlogPostsWithoutContent(@Param("keyword") String keyword);
}
