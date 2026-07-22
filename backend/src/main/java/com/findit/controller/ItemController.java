package com.findit.controller;

import com.findit.dto.ApiResponse;
import com.findit.dto.ItemRequestDTO;
import com.findit.dto.ItemResponseDTO;
import com.findit.entity.Category;
import com.findit.entity.ItemStatus;
import com.findit.entity.ItemType;
import com.findit.service.ItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller exposing /api/items endpoints for Lost & Found post operations.
 * 
 * CORS is managed globally via WebConfig.java.
 */
@RestController
@RequestMapping("/api/items")
@RequiredArgsConstructor
public class ItemController {

    private final ItemService itemService;

    /**
     * GET /api/items
     * Fetch & filter community feed posts.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<ItemResponseDTO>>> getAllItems(
            @RequestParam(required = false) ItemType type,
            @RequestParam(required = false) Category category,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) ItemStatus status,
            @RequestParam(required = false) String search) {

        List<ItemResponseDTO> items = itemService.getAllItems(type, category, location, status, search);
        return ResponseEntity.ok(ApiResponse.success("Items retrieved successfully", items));
    }

    /**
     * GET /api/items/{id}
     * Fetch details of a single post by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ItemResponseDTO>> getItemById(@PathVariable Long id) {
        ItemResponseDTO item = itemService.getItemById(id);
        return ResponseEntity.ok(ApiResponse.success("Item details retrieved successfully", item));
    }

    /**
     * POST /api/items
     * Create a new Lost or Found item report. Returns HTTP 201 Created.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<ItemResponseDTO>> createItem(@Valid @RequestBody ItemRequestDTO dto) {
        ItemResponseDTO createdItem = itemService.createItem(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Item report created successfully", createdItem));
    }

    /**
     * PUT /api/items/{id}
     * Update complete details of an existing post. Returns HTTP 200 OK.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ItemResponseDTO>> updateItem(
            @PathVariable Long id,
            @Valid @RequestBody ItemRequestDTO dto) {

        ItemResponseDTO updatedItem = itemService.updateItem(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Item updated successfully", updatedItem));
    }

    /**
     * PATCH /api/items/{id}/status?status=RETURNED
     * Partial update to toggle status field. Returns HTTP 200 OK.
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<ItemResponseDTO>> updateStatus(
            @PathVariable Long id,
            @RequestParam ItemStatus status) {

        ItemResponseDTO updatedItem = itemService.updateStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Item status updated to " + status, updatedItem));
    }

    /**
     * DELETE /api/items/{id}
     * Remove a post. Returns HTTP 204 No Content.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        itemService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }
}
