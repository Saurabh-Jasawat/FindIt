package com.findit.service.impl;

import com.findit.dto.ItemRequestDTO;
import com.findit.dto.ItemResponseDTO;
import com.findit.entity.Category;
import com.findit.entity.Item;
import com.findit.entity.ItemStatus;
import com.findit.entity.ItemType;
import com.findit.exception.ResourceNotFoundException;
import com.findit.mapper.ItemMapper;
import com.findit.repository.ItemRepository;
import com.findit.service.ItemService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service Implementation class providing business logic for Lost & Found items.
 * 
 * Uses @Service and @Transactional annotations to manage transactions.
 * Annotated with @Slf4j to enable modern SLF4J logging.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ItemServiceImpl implements ItemService {

    private final ItemRepository itemRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ItemResponseDTO> getAllItems(ItemType type, Category category, String location, ItemStatus status, String search) {
        log.info("Fetching all items with filters - type: {}, category: {}, status: {}, search: {}", type, category, status, search);
        List<Item> items = itemRepository.findAllByOrderByCreatedAtDesc();

        // Service layer filtering coordination
        return items.stream()
                .filter(item -> type == null || item.getType() == type)
                .filter(item -> category == null || item.getCategory() == category)
                .filter(item -> status == null || item.getStatus() == status)
                .filter(item -> location == null || location.isBlank() || 
                        item.getLocation().toLowerCase().contains(location.toLowerCase()))
                .filter(item -> search == null || search.isBlank() || 
                        item.getTitle().toLowerCase().contains(search.toLowerCase()) || 
                        item.getDescription().toLowerCase().contains(search.toLowerCase()) ||
                        item.getLocation().toLowerCase().contains(search.toLowerCase()))
                .map(ItemMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ItemResponseDTO getItemById(Long id) {
        log.info("Fetching item by ID: {}", id);
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Item post not found with ID: {}", id);
                    return new ResourceNotFoundException("Item post not found with id: " + id);
                });
        return ItemMapper.toResponseDTO(item);
    }

    @Override
    @Transactional
    public ItemResponseDTO createItem(ItemRequestDTO dto) {
        log.info("Creating new item post: {}", dto.getTitle());
        Item item = ItemMapper.toEntity(dto);
        Item savedItem = itemRepository.save(item);
        log.info("Item post created successfully with ID: {}", savedItem.getId());
        return ItemMapper.toResponseDTO(savedItem);
    }

    @Override
    @Transactional
    public ItemResponseDTO updateItem(Long id, ItemRequestDTO dto) {
        log.info("Updating item post with ID: {}", id);
        Item existingItem = itemRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Item post not found for update with ID: {}", id);
                    return new ResourceNotFoundException("Item post not found with id: " + id);
                });

        existingItem.setType(dto.getType());
        existingItem.setTitle(dto.getTitle());
        existingItem.setDescription(dto.getDescription());
        existingItem.setCategory(dto.getCategory());
        existingItem.setLocation(dto.getLocation());
        existingItem.setImageUrl(dto.getImageUrl());
        existingItem.setDate(dto.getDate());
        if (dto.getStatus() != null) {
            existingItem.setStatus(dto.getStatus());
        }
        existingItem.setContactName(dto.getContactName());
        existingItem.setContactPhone(dto.getContactPhone());

        Item updatedItem = itemRepository.save(existingItem);
        log.info("Item post with ID: {} updated successfully", id);
        return ItemMapper.toResponseDTO(updatedItem);
    }

    @Override
    @Transactional
    public ItemResponseDTO updateStatus(Long id, ItemStatus status) {
        log.info("Updating status of item ID: {} to {}", id, status);
        Item existingItem = itemRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Item post not found for status update with ID: {}", id);
                    return new ResourceNotFoundException("Item post not found with id: " + id);
                });

        existingItem.setStatus(status);
        Item updatedItem = itemRepository.save(existingItem);
        log.info("Item ID: {} status updated successfully to {}", id, status);
        return ItemMapper.toResponseDTO(updatedItem);
    }

    @Override
    @Transactional
    public void deleteItem(Long id) {
        log.info("Deleting item post with ID: {}", id);
        Item existingItem = itemRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Item post not found for deletion with ID: {}", id);
                    return new ResourceNotFoundException("Item post not found with id: " + id);
                });
        itemRepository.delete(existingItem);
        log.info("Item post with ID: {} deleted successfully", id);
    }
}

