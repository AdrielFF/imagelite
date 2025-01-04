package io.github.adrielff.imageliteapi.application.images;

import java.time.LocalDate;

public record ImageDTO(
    String url,
    String name,
    String extension,
    Long size,
    LocalDate uploadDate
) {
}
