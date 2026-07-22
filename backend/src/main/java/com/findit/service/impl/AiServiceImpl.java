package com.findit.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.findit.dto.*;
import com.findit.service.AiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Service Implementation class consuming Google's Gemini REST API.
 * 
 * Explanation for Interviews:
 * Uses RestTemplate to consume Google's Gemini 1.5 API model.
 * Demonstrates prompt engineering for three distinct assistant tasks:
 * 1. Narrative generation (Description Generator)
 * 2. Classification & constraint matching (Category Suggestion)
 * 3. Structured quality assessment (Content Validation)
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AiServiceImpl implements AiService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${gemini.api.key:}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrlPrefix;

    // Set of allowed categories for verification
    private static final Set<String> ALLOWED_CATEGORIES = Set.of(
            "MOBILE", "WALLET", "KEYS", "DOCUMENT", "ID_CARD", "BAG", "ELECTRONICS", "OTHER"
    );

    @Override
    public AiResponseDTO generateDescription(AiRequestDTO request) {
        log.info("Generating description for item: '{}' in '{}'", request.getTitle(), request.getLocation());

        if (isApiKeyMissing()) {
            return new AiResponseDTO("Unable to generate description. Please enter it manually.");
        }

        try {
            String promptText = String.format(
                "Write a professional, concise lost and found description for an item with title: '%s', category: '%s', located at: '%s'. " +
                "Keep the description brief (2-3 sentences), helpful for identification, and do not include any brackets or placeholders.",
                request.getTitle(), request.getCategory(), request.getLocation()
            );

            String generated = callGemini(promptText);
            if (generated == null || generated.isBlank()) {
                return new AiResponseDTO("Unable to generate description. Please enter it manually.");
            }
            return new AiResponseDTO(generated.trim());
        } catch (Exception ex) {
            log.error("Error in AI Description Generation: {}", ex.getMessage());
            return new AiResponseDTO("Unable to generate description. Please enter it manually.");
        }
    }

    @Override
    public AiCategoryResponseDTO suggestCategory(AiCategoryRequestDTO request) {
        log.info("Suggesting category for item title: '{}'", request.getTitle());

        if (isApiKeyMissing()) {
            return new AiCategoryResponseDTO("OTHER");
        }

        try {
            String promptText = String.format(
                "Suggest a category for an item titled '%s'. " +
                "You must respond with exactly one word from this list: [MOBILE, WALLET, KEYS, DOCUMENT, ID_CARD, BAG, ELECTRONICS, OTHER]. " +
                "Do not include any formatting, markdown, punctuation, or other text.",
                request.getTitle()
            );

            String result = callGemini(promptText);
            if (result != null) {
                String cleanCategory = result.trim().toUpperCase();
                if (ALLOWED_CATEGORIES.contains(cleanCategory)) {
                    log.info("AI suggested category: '{}'", cleanCategory);
                    return new AiCategoryResponseDTO(cleanCategory);
                }
            }
            log.warn("Gemini returned invalid category suggestion: '{}'. Defaulting to OTHER.", result);
            return new AiCategoryResponseDTO("OTHER");
        } catch (Exception ex) {
            log.error("Error in AI Category Suggestion: {}", ex.getMessage());
            return new AiCategoryResponseDTO("OTHER");
        }
    }

    @Override
    public AiValidationResponseDTO validateContent(AiValidationRequestDTO request) {
        log.info("Validating content quality for title: '{}'", request.getTitle());

        // Default response when offline or missing key (always pass to never block user submission)
        AiValidationResponseDTO defaultValid = new AiValidationResponseDTO("VALID", new ArrayList<>());

        if (isApiKeyMissing()) {
            return defaultValid;
        }

        try {
            String promptText = String.format(
                "You are an automated reviewer for a Lost & Found board. Evaluate if the following post is meaningful and realistic.\n" +
                "Item Title: '%s'\n" +
                "Description: '%s'\n\n" +
                "Rules:\n" +
                "1. If description is too vague, short, or generic (e.g. less than 15 characters, or just 'lost phone', 'keys', 'asdf'), status must be 'WARNING' and warnings must contain 'Description is too vague. Please add identifying details.'\n" +
                "2. If the item is unrealistic (e.g. 'lost helicopter', 'found submarine', 'spaceship', 'dinosaur'), status must be 'WARNING' and warnings must contain 'This report appears unrealistic. Please review before submitting.'\n" +
                "3. Otherwise, if the report has realistic text and useful details, status is 'VALID' and warnings list is empty.\n\n" +
                "Format response exactly as raw JSON in this structure with no surrounding markdown tags, formatting, or extra text:\n" +
                "{\n" +
                "  \"status\": \"VALID\" or \"WARNING\",\n" +
                "  \"warnings\": [\"string warnings\"]\n" +
                "}",
                request.getTitle(), request.getDescription()
            );

            String result = callGemini(promptText);
            if (result != null && !result.isBlank()) {
                // Strip markdown wrappers if any
                String cleanJson = result.replaceAll("```json", "").replaceAll("```", "").trim();
                AiValidationResponseDTO mappedResponse = objectMapper.readValue(cleanJson, AiValidationResponseDTO.class);
                log.info("Validation complete. Status: {}, Warning Count: {}", mappedResponse.getStatus(), mappedResponse.getWarnings().size());
                return mappedResponse;
            }
        } catch (Exception ex) {
            log.error("Error in AI Content Validation: {}", ex.getMessage());
        }

        return defaultValid;
    }

    /**
     * Helper method to verify if the API key is configured.
     */
    private boolean isApiKeyMissing() {
        if (apiKey == null || apiKey.trim().isEmpty()) {
            log.warn("Gemini API Key is missing. Feature deactivated gracefully.");
            return true;
        }
        return false;
    }

    /**
     * Shared helper to make the REST call to Google's Gemini API.
     */
    private String callGemini(String prompt) {
        String fullUrl = apiUrlPrefix + apiKey;

        Map<String, Object> textPart = Map.of("text", prompt);
        Map<String, Object> partsContainer = Map.of("parts", List.of(textPart));
        Map<String, Object> contentContainer = Map.of("contents", List.of(partsContainer));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(contentContainer, headers);
        Map<?, ?> responseBody = restTemplate.postForObject(fullUrl, entity, Map.class);

        if (responseBody != null && responseBody.containsKey("candidates")) {
            List<?> candidates = (List<?>) responseBody.get("candidates");
            if (!candidates.isEmpty()) {
                Map<?, ?> firstCandidate = (Map<?, ?>) candidates.get(0);
                Map<?, ?> content = (Map<?, ?>) firstCandidate.get("content");
                List<?> parts = (List<?>) content.get("parts");
                Map<?, ?> firstPart = (Map<?, ?>) parts.get(0);
                return (String) firstPart.get("text");
            }
        }
        return null;
    }
}
