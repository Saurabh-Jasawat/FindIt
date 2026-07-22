package com.findit.service;

import com.findit.dto.ItemRequestDTO;
import com.findit.dto.ItemResponseDTO;
import com.findit.entity.Category;
import com.findit.entity.Item;
import com.findit.entity.ItemStatus;
import com.findit.entity.ItemType;
import com.findit.exception.ResourceNotFoundException;
import com.findit.repository.ItemRepository;
import com.findit.service.impl.ItemServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Service Layer Unit Tests using JUnit 5 and Mockito.
 * 
 * Explanation for Interviews:
 * We mock the repository layer (ItemRepository) using @Mock so that our unit tests
 * focus exclusively on testing the business logic inside ItemServiceImpl.
 * We inject these mocks using @InjectMocks.
 */
@ExtendWith(MockitoExtension.class)
public class ItemServiceTest {

    @Mock
    private ItemRepository itemRepository;

    @InjectMocks
    private ItemServiceImpl itemService;

    private Item sampleItem;
    private ItemRequestDTO sampleRequestDTO;

    @BeforeEach
    void setUp() {
        sampleItem = Item.builder()
                .id(1L)
                .type(ItemType.LOST)
                .title("Black Leather Wallet")
                .description("Lost in library 2nd floor")
                .category(Category.WALLET)
                .location("Library")
                .imageUrl("http://example.com/wallet.jpg")
                .date(LocalDate.of(2026, 7, 21))
                .status(ItemStatus.ACTIVE)
                .contactName("Rahul Sharma")
                .contactPhone("9876543210")
                .build();

        sampleRequestDTO = ItemRequestDTO.builder()
                .type(ItemType.LOST)
                .title("Black Leather Wallet")
                .description("Lost in library 2nd floor")
                .category(Category.WALLET)
                .location("Library")
                .imageUrl("http://example.com/wallet.jpg")
                .date(LocalDate.of(2026, 7, 21))
                .status(ItemStatus.ACTIVE)
                .contactName("Rahul Sharma")
                .contactPhone("9876543210")
                .build();
    }

    @Test
    @DisplayName("Create Item - Success Case")
    void testCreateItem_Success() {
        // Arrange (Stub repository save method)
        when(itemRepository.save(any(Item.class))).thenReturn(sampleItem);

        // Act
        ItemResponseDTO response = itemService.createItem(sampleRequestDTO);

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getTitle()).isEqualTo("Black Leather Wallet");
        assertThat(response.getStatus()).isEqualTo(ItemStatus.ACTIVE);

        // Verify that save() was called exactly once
        verify(itemRepository, times(1)).save(any(Item.class));
    }

    @Test
    @DisplayName("Get Item By ID - Success Case")
    void testGetItemById_Success() {
        // Arrange
        when(itemRepository.findById(1L)).thenReturn(Optional.of(sampleItem));

        // Act
        ItemResponseDTO response = itemService.getItemById(1L);

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getTitle()).isEqualTo("Black Leather Wallet");

        verify(itemRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Get Item By ID - Resource Not Found Exception Case")
    void testGetItemById_NotFound_ThrowsException() {
        // Arrange
        when(itemRepository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            itemService.getItemById(99L);
        });

        verify(itemRepository, times(1)).findById(99L);
    }

    @Test
    @DisplayName("Update Item Details - Success Case")
    void testUpdateItem_Success() {
        // Arrange
        when(itemRepository.findById(1L)).thenReturn(Optional.of(sampleItem));
        when(itemRepository.save(any(Item.class))).thenReturn(sampleItem);

        // Act
        ItemResponseDTO response = itemService.updateItem(1L, sampleRequestDTO);

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(1L);
        
        verify(itemRepository, times(1)).findById(1L);
        verify(itemRepository, times(1)).save(any(Item.class));
    }

    @Test
    @DisplayName("Update Item Status - Success Case")
    void testUpdateStatus_Success() {
        // Arrange
        when(itemRepository.findById(1L)).thenReturn(Optional.of(sampleItem));
        
        Item updatedStatusItem = Item.builder()
                .id(1L)
                .status(ItemStatus.RETURNED)
                .build();
        when(itemRepository.save(any(Item.class))).thenReturn(updatedStatusItem);

        // Act
        ItemResponseDTO response = itemService.updateStatus(1L, ItemStatus.RETURNED);

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.getStatus()).isEqualTo(ItemStatus.RETURNED);

        verify(itemRepository, times(1)).findById(1L);
        verify(itemRepository, times(1)).save(any(Item.class));
    }

    @Test
    @DisplayName("Delete Item - Success Case")
    void testDeleteItem_Success() {
        // Arrange
        when(itemRepository.findById(1L)).thenReturn(Optional.of(sampleItem));
        doNothing().when(itemRepository).delete(any(Item.class));

        // Act
        itemService.deleteItem(1L);

        // Assert (No exception thrown, verify calls)
        verify(itemRepository, times(1)).findById(1L);
        verify(itemRepository, times(1)).delete(any(Item.class));
    }
}
