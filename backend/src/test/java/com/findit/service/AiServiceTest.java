package com.findit.service;

import com.findit.dto.*;
import com.findit.service.impl.AiServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AiServiceTest {

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private AiServiceImpl aiService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(aiService, "apiKey", "mock-api-key");
        ReflectionTestUtils.setField(aiService, "apiUrlPrefix", "http://mock-gemini.api/content?key=");
    }

    @Test
    @DisplayName("Generate Description - Success Case")
    void testGenerateDescription_Success() {
        AiRequestDTO sampleRequest = AiRequestDTO.builder()
                .title("Black Wallet")
                .category("WALLET")
                .location("GLA Library")
                .build();

        Map<String, Object> mockPart = Map.of("text", "A black leather wallet was lost near the GLA Library.");
        Map<String, Object> mockContent = Map.of("parts", List.of(mockPart));
        Map<String, Object> mockResponse = Map.of("candidates", List.of(Map.of("content", mockContent)));

        when(restTemplate.postForObject(anyString(), any(), eq(Map.class))).thenReturn(mockResponse);

        AiResponseDTO response = aiService.generateDescription(sampleRequest);

        assertThat(response).isNotNull();
        assertThat(response.getDescription()).isEqualTo("A black leather wallet was lost near the GLA Library.");
    }

    @Test
    @DisplayName("Suggest Category - Success Case")
    void testSuggestCategory_Success() {
        AiCategoryRequestDTO request = new AiCategoryRequestDTO("Samsung Galaxy S23");
        Map<String, Object> mockPart = Map.of("text", "ELECTRONICS");
        Map<String, Object> mockContent = Map.of("parts", List.of(mockPart));
        Map<String, Object> mockResponse = Map.of("candidates", List.of(Map.of("content", mockContent)));

        when(restTemplate.postForObject(anyString(), any(), eq(Map.class))).thenReturn(mockResponse);

        AiCategoryResponseDTO response = aiService.suggestCategory(request);

        assertThat(response).isNotNull();
        assertThat(response.getSuggestedCategory()).isEqualTo("ELECTRONICS");
    }

    @Test
    @DisplayName("Suggest Category - Fallback to OTHER Case")
    void testSuggestCategory_Fallback() {
        AiCategoryRequestDTO request = new AiCategoryRequestDTO("Alien Spacecraft");
        Map<String, Object> mockPart = Map.of("text", "VEHICLE"); // Not in allowed categories
        Map<String, Object> mockContent = Map.of("parts", List.of(mockPart));
        Map<String, Object> mockResponse = Map.of("candidates", List.of(Map.of("content", mockContent)));

        when(restTemplate.postForObject(anyString(), any(), eq(Map.class))).thenReturn(mockResponse);

        AiCategoryResponseDTO response = aiService.suggestCategory(request);

        assertThat(response).isNotNull();
        assertThat(response.getSuggestedCategory()).isEqualTo("OTHER");
    }

    @Test
    @DisplayName("Validate Content - Valid Case")
    void testValidateContent_Valid() {
        AiValidationRequestDTO request = new AiValidationRequestDTO("Black Leather Wallet", "Found a premium black leather wallet with cards near GLA Library staircase.");
        Map<String, Object> mockPart = Map.of("text", "{\n  \"status\": \"VALID\",\n  \"warnings\": []\n}");
        Map<String, Object> mockContent = Map.of("parts", List.of(mockPart));
        Map<String, Object> mockResponse = Map.of("candidates", List.of(Map.of("content", mockContent)));

        when(restTemplate.postForObject(anyString(), any(), eq(Map.class))).thenReturn(mockResponse);

        AiValidationResponseDTO response = aiService.validateContent(request);

        assertThat(response).isNotNull();
        assertThat(response.getStatus()).isEqualTo("VALID");
        assertThat(response.getWarnings()).isEmpty();
    }

    @Test
    @DisplayName("Validate Content - Warning Case")
    void testValidateContent_Warning() {
        AiValidationRequestDTO request = new AiValidationRequestDTO("lost helicopter", "lost high in sky");
        Map<String, Object> mockPart = Map.of("text", "{\n  \"status\": \"WARNING\",\n  \"warnings\": [\"This report appears unrealistic. Please review before submitting.\"]\n}");
        Map<String, Object> mockContent = Map.of("parts", List.of(mockPart));
        Map<String, Object> mockResponse = Map.of("candidates", List.of(Map.of("content", mockContent)));

        when(restTemplate.postForObject(anyString(), any(), eq(Map.class))).thenReturn(mockResponse);

        AiValidationResponseDTO response = aiService.validateContent(request);

        assertThat(response).isNotNull();
        assertThat(response.getStatus()).isEqualTo("WARNING");
        assertThat(response.getWarnings()).contains("This report appears unrealistic. Please review before submitting.");
    }
}
