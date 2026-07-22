package com.findit.repository;

import com.findit.entity.Category;
import com.findit.entity.Item;
import com.findit.entity.ItemStatus;
import com.findit.entity.ItemType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface extending JpaRepository to provide standard CRUD operations
 * and clean derived query methods for searching and filtering.
 */
@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {

    // Derived Query Methods for filtering
    List<Item> findByType(ItemType type);

    List<Item> findByCategory(Category category);

    List<Item> findByStatus(ItemStatus status);

    List<Item> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String title, String description);

    List<Item> findByLocationContainingIgnoreCase(String location);

    // Sort items by creation timestamp descending (newest posts first)
    List<Item> findAllByOrderByCreatedAtDesc();
}
