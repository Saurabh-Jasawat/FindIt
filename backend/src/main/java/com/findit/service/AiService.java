package com.findit.service;

import com.findit.dto.AiRequestDTO;
import com.findit.dto.AiResponseDTO;
import com.findit.dto.AiCategoryRequestDTO;
import com.findit.dto.AiCategoryResponseDTO;
import com.findit.dto.AiValidationRequestDTO;
import com.findit.dto.AiValidationResponseDTO;

/**
 * Service interface for AI-assisted features (Gemini integrations).
 */
public interface AiService {

    AiResponseDTO generateDescription(AiRequestDTO request);

    AiCategoryResponseDTO suggestCategory(AiCategoryRequestDTO request);

    AiValidationResponseDTO validateContent(AiValidationRequestDTO request);
}
