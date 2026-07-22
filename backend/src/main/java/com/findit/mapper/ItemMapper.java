package com.findit.mapper;

import com.findit.dto.ItemRequestDTO;
import com.findit.dto.ItemResponseDTO;
import com.findit.entity.Item;
import com.findit.entity.ItemStatus;

/**
 * Utility Mapper class to convert between Item Entity and DTOs.
 * 
 * Explanation for Interviews:
 * Keeps mapping logic encapsulated in one place instead of cluttering
 * Controllers or Service implementations.
 */
public class ItemMapper {

    /**
     * Converts ItemRequestDTO to Item Entity.
     */
    public static Item toEntity(ItemRequestDTO dto) {
        if (dto == null) {
            return null;
        }

        return Item.builder()
                .type(dto.getType())
                .title(dto.getTitle())
                .description(dto.getDescription())
                .category(dto.getCategory())
                .location(dto.getLocation())
                .imageUrl(dto.getImageUrl())
                .date(dto.getDate())
                .status(dto.getStatus() != null ? dto.getStatus() : ItemStatus.ACTIVE)
                .contactName(dto.getContactName())
                .contactPhone(dto.getContactPhone())
                .build();
    }

    /**
     * Converts Item Entity to ItemResponseDTO.
     */
    public static ItemResponseDTO toResponseDTO(Item item) {
        if (item == null) {
            return null;
        }

        return ItemResponseDTO.builder()
                .id(item.getId())
                .type(item.getType())
                .title(item.getTitle())
                .description(item.getDescription())
                .category(item.getCategory())
                .location(item.getLocation())
                .imageUrl(item.getImageUrl())
                .date(item.getDate())
                .status(item.getStatus())
                .contactName(item.getContactName())
                .contactPhone(item.getContactPhone())
                .createdAt(item.getCreatedAt())
                .updatedAt(item.getUpdatedAt())
                .build();
    }
}
