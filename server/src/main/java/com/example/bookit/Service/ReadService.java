package com.example.bookit.Service;

import com.example.bookit.Entities.Read;
import com.example.bookit.Entities.User;
import com.example.bookit.Entities.Book;
import com.example.bookit.Repository.ReadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReadService {

    @Autowired
    private ReadRepository readRepository;

    public Read markAsRead(User user, Book book) {
        Read read = new Read(user, book);
        return readRepository.save(read);
    }

    public void unmarkAsRead(Long readId) {
        readRepository.deleteById(readId);
    }

    public List<Read> listRead(User user) {
        return readRepository.findAllByUser(user);

    }
}
