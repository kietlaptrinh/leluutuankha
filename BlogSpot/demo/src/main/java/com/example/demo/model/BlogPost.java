package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

import java.util.Date;

@Entity
public class BlogPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    @Lob  // Thêm annotation @Lob để đánh dấu trường này có thể lưu trữ dữ liệu lớn
    private String content;

    @ManyToOne
    @JoinColumn(name = "category_id") // Mối quan hệ với bảng Category
    @JsonProperty("category") // Thêm @JsonProperty nếu muốn ánh xạ rõ ràng hơn
    private Category category; // Trường này nên là đối tượng Category

    private String image; // Lưu tên file hình ảnh

    @Temporal(TemporalType.TIMESTAMP)
    private Date date; // Trường lưu thời gian đăng bài

    private String status; // Trường trạng thái "draft" (bản nháp), "published" (đã xuất bản)

    @PrePersist
    public void prePersist() {
        if (this.date == null) {
            this.date = new Date(); // Nếu không có ngày thì gán ngày hiện tại
        }
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
