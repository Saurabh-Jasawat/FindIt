package com.findit.service;

import com.findit.dto.ItemRequestDTO;
import com.findit.dto.ItemResponseDTO;
import com.findit.entity.Category;
import com.findit.entity.ItemStatus;
import com.findit.entity.ItemType;

import java.util.List;

/**
 * Service interface defining business logic operations for Item management.
 */
public interface ItemService {

    List<ItemResponseDTO> getAllItems(ItemType type, Category category, String location, ItemStatus status, String search);

    ItemResponseDTO getItemById(Long id);

    ItemResponseDTO createItem(ItemRequestDTO dto);

    ItemResponseDTO updateItem(Long id, ItemRequestDTO dto);

    ItemResponseDTO updateStatus(Long id, ItemStatus status);

    void deleteItem(Long id);
}
