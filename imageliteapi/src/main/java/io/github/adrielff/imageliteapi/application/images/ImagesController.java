package io.github.adrielff.imageliteapi.application.images;

import io.github.adrielff.imageliteapi.domain.entity.Image;
import io.github.adrielff.imageliteapi.domain.enums.ImageExtension;
import jdk.jfr.ContentType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.net.URI;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/v1/images")
@Slf4j
@RequiredArgsConstructor
@CrossOrigin("*")
public class ImagesController {

    private final ImageServiceImpl service;
    private final ImageMapper mapper;

    @PostMapping
    public ResponseEntity<Object> save(
            @RequestParam MultipartFile file,
            @RequestParam String name,
            @RequestParam List<String> tags
            ) throws IOException {

        Image image = mapper.toImage(file, name, tags);
        Image savedImage = service.save(image);
        URI savedImageURI = buildImageURI(savedImage);

        return ResponseEntity.created(savedImageURI).build();
    }

    @GetMapping("{id}")
    public ResponseEntity<byte[]> getImage(@PathVariable UUID id) {
        Optional<Image> possibleImage = service.findById(id);

        if(possibleImage.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Image image = possibleImage.get();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(image.getExtension().getMediaType());
        headers.setContentLength(image.getSize());
        headers.setContentDisposition(ContentDisposition.inline().filename(image.getFileName()).build());

        return new ResponseEntity<>(image.getFile(), headers, HttpStatus.OK);
    }

    @GetMapping("{id}/download")
    public ResponseEntity<byte[]> downloadImage(@PathVariable UUID id) {
        Optional<Image> possibleImage = service.findById(id);

        if(possibleImage.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Image image = possibleImage.get();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(image.getExtension().getMediaType());
        headers.setContentLength(image.getSize());
        headers.setContentDisposition(ContentDisposition.attachment().filename(image.getFileName()).build());

        return new ResponseEntity<>(image.getFile(), headers, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<ImageDTO>> search(
            @RequestParam(value = "extension", required = false) String extension,
            @RequestParam(value = "query", required = false) String query
    ) {
        var result = service.search(ImageExtension.ofName(extension), query);

        var images = result.stream().map(image -> {
            var url = buildImageURI(image);
            return mapper.toDto(image, url.toString());
        }).collect(Collectors.toList());

        return ResponseEntity.ok(images);
    }

    private URI buildImageURI(Image image) {
        String imagePath = "/" + image.getId();

        return ServletUriComponentsBuilder
                .fromCurrentRequestUri()
                .path(imagePath)
                .build()
                .toUri();
    }
}
