package io.github.adrielff.imageliteapi.application.images;

import io.github.adrielff.imageliteapi.domain.entity.Image;
import io.github.adrielff.imageliteapi.domain.enums.ImageExtension;
import io.github.adrielff.imageliteapi.domain.service.ImageService;
import io.github.adrielff.imageliteapi.infra.ImageRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ImageServiceImpl implements ImageService {

    private final ImageRepository repository;

    @Transactional
    @Override
    public Image save(Image image) {
        return repository.save(image);
    }

    @Override
    public Optional<Image> findById(UUID id) {
        return repository.findById(id);
    }

    @Override
    public List<Image> search(ImageExtension extension, String query) {
        return repository.findByExtensionAndNameOrTagsLike(extension, query);
    }

}
