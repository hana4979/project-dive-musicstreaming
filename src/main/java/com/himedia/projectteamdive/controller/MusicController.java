package com.himedia.projectteamdive.controller;

import com.himedia.projectteamdive.dto.AlbumDto;
import com.himedia.projectteamdive.dto.MusicDto;
import com.himedia.projectteamdive.dto.PlaylistDto;
import com.himedia.projectteamdive.entity.*;
import com.himedia.projectteamdive.repository.MusicRepository;
import com.himedia.projectteamdive.service.MusicService;
import com.himedia.projectteamdive.service.S3Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/music")
public class MusicController {

    @Autowired
    MusicService ms;
    //=============================================admin 사용기능
    @PostMapping("/insertMusic")
    public HashMap<String, Object> insertMusic(@RequestBody Music music) {
        HashMap<String, Object> map = new HashMap<>();
        ms.insertMusic(music);
        map.put("msg","yes");
        return map;
    }

    @PostMapping("/insertAlbum")
    public HashMap<String, Object> insertAlbum(@RequestBody Album album) {
        HashMap<String, Object> map = new HashMap<>();
        Album savedAlbum=ms.insertAlbum(album);
        map.put("album",savedAlbum);
        map.put("msg","yes");
        return map;
    }
    @PostMapping("/insertArtist")
    public HashMap<String, Object> insertArtist(@RequestBody Artist artist) {
        HashMap<String, Object> map = new HashMap<>();
        Artist savedArtist = ms.insertArtist(artist);
        map.put("msg","yes");
        map.put("artist", savedArtist);
        return map;
    }


    @PostMapping("/updateArtist")
    public HashMap<String, Object> updateArtist(@RequestBody Artist artist) {
        HashMap<String, Object> map = new HashMap<>();
        ms.updateArtist(artist);
        map.put("msg","yes");
        map.put("artist", artist);
        return map;
    }
    @PostMapping("/updateAlbum")
    public HashMap<String, Object> updateAlbum(@RequestBody Album album) {
        HashMap<String, Object> map = new HashMap<>();
        ms.updateAlbum(album);
        map.put("msg","yes");
        map.put("album", album);
        return map;
    }
    @PostMapping("/updateAlbumReorder")
    public HashMap<String, Object> updateAlbumReorder(@RequestBody List<Integer> musicIds, @RequestParam("albumId")int albumId) {
        HashMap<String, Object> map = new HashMap<>();
        ms.updateAlbumReorder(musicIds,albumId);
        map.put("msg","yes");
        return map;
    }


    @PostMapping("/updateMusic")
    public HashMap<String, Object> updateMusic(@RequestBody Music music) {
        HashMap<String, Object> map = new HashMap<>();
        ms.updateMusic(music);
        map.put("msg","yes");
        map.put("music",music);
        return map;
    }

    @DeleteMapping("/deleteArtist")
    public HashMap<String, Object> deleteArtist(@RequestParam("artistId")int artistId) {
        HashMap<String, Object> map = new HashMap<>();
        ms.deleteArtist(artistId);
        map.put("msg","yes");
        return map;
    }
    @DeleteMapping("/deleteAlbum")
    public HashMap<String, Object> deleteAlbum(@RequestParam("albumId")int albumId) {
        HashMap<String, Object> map = new HashMap<>();
        ms.deleteAlbum(albumId);
        map.put("msg","yes");
        return map;
    }
    @DeleteMapping("/deleteMusic")
    public HashMap<String, Object> deleteMusic(@RequestParam("musicId")int musicId) {
        HashMap<String, Object> map = new HashMap<>();

        ms.deleteMusic(musicId);
        map.put("msg","yes");
        return map;
    }
    @Autowired
    S3Service ss;
    @PostMapping("/musicUpload")
    public HashMap<String, Object> musicUpload(@RequestParam("music") MultipartFile file) {
        HashMap<String, Object> map = new HashMap<>();
        try {
            String uploadFilePath=ss.saveFile(file,"music");
            map.put("music",uploadFilePath);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return map;
    }
    @PostMapping("/imageUpload")
    public HashMap<String, Object> imageUpload(@RequestParam("image") MultipartFile file) {
        HashMap<String, Object> map = new HashMap<>();
        try {
            String uploadFilePath=ss.saveFile(file,"image");
            map.put("image",uploadFilePath);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return map;
    }
    @DeleteMapping("/deleteFile")
    public HashMap<String, Object> deleteFile(@RequestParam(value = "file",required = false)String image) {
        if(image==null){
            image="";
        }
        HashMap<String, Object> map = new HashMap<>();
        String s = image.replace("https://d9k8tjx0yo0q5.cloudfront.net/","");
        ss.deleteFile(s);
        map.put("msg","yes");
        return map;
    }


    //=====================================================

    @PostMapping("/insertPlaylist")
    public HashMap<String, Object> insertPlayList(@RequestParam("memberId")String memberId,@RequestBody Playlist playlist) {
        HashMap<String, Object> map = new HashMap<>();
        ms.insertPlayList(memberId,playlist);
        map.put("msg","yes");
        return map;
    }
    //음악을 제외한 다른내용들 수정
    @PostMapping("/updatePlaylist")
    public HashMap<String, Object> updatePlayList(@RequestBody Playlist playlist) {
        HashMap<String, Object> map = new HashMap<>();
        ms.updatePlaylist(playlist);
        map.put("msg","yes");
        return map;
    }

    @PostMapping("/updatePlaylistAddMusic")
    public HashMap<String, Object> updatePlaylistAddMusic(@RequestParam("playlistId")int playlistId, @RequestBody List<Integer> musicId) {
        HashMap<String, Object> map = new HashMap<>();
        ms.updatePlaylistAddMusic(playlistId,musicId);
        map.put("msg","yes");
        return map;
    }

    @PostMapping("/updatePlaylistReorder")
    public HashMap<String,Object> updatePlaylistReorder(@RequestParam("playlistId")int playlistId, @RequestBody List<Integer> musicIds) {
        HashMap<String, Object> map = new HashMap<>();
        ms.updatePlaylistReorder(playlistId,musicIds);
        map.put("msg","yes");
        return map;
    }

    @PostMapping("/updatePlaylistDeleteMusic")
    public HashMap<String,Object> updatePlaylistDeleteMusic(@RequestParam("playlistId")int playlistId, @RequestBody List<Integer> musicId) {
        HashMap<String, Object> map = new HashMap<>();
        ms.updatePlaylistDeleteMusic(playlistId,musicId);
        map.put("msg","yes");
        return map;
    }

    @DeleteMapping("deletePlaylist")
    public HashMap<String, Object> deletePlaylist(@RequestParam("PlaylistId")int playlistId) {
        HashMap<String, Object> map = new HashMap<>();
        ms.deletePlaylist(playlistId);
        map.put("msg","yes");
        return map;
    }


    //음악 재생수 증가메서드
    @PostMapping("/addPlayCount")
    public HashMap<String, Object> addPlayCount(@RequestBody HashMap<Integer,Integer> playCount,@RequestParam(value = "memberId",required = false)String memberId) {
        System.out.println(playCount);
        if(memberId==null) {memberId="";}
        HashMap<String, Object> map = new HashMap<>();
        ms.addPlayCount(playCount,memberId);
        map.put("msg","yes");
        return map;
    }

    @GetMapping("/getMusicChart")
    public HashMap<String, Object> getMusicChart() {
        HashMap<String, Object> map = ms.getMusicChart();
        return map;
    }

    @GetMapping("/getAlbumChart")
    public HashMap<String, Object> getAlbumChart() {
        HashMap<String, Object> map = new HashMap<>();
        List<AlbumDto>albumList= ms.getAlbumChart();
        map.put("albumList",albumList);
        return map;
    }

    @GetMapping("/getArtist")
    public HashMap<String, Object> getArtist(@RequestParam("artistId")int artistId) {
        HashMap<String, Object> map = new HashMap<>();
        map.put("artist",ms.getArtist(artistId));
        return map;
    }
    @GetMapping("/getAlbum")
    public HashMap<String, Object> getAlbum(@RequestParam("albumId")int albumId) {
        HashMap<String, Object> map = new HashMap<>();
        map.put("album",ms.getAlbum(albumId));
        return map;
    }
    @GetMapping("/getMusic")
    public HashMap<String, Object> getMusic(@RequestParam("musicId")int musicId) {
        HashMap<String, Object> map = new HashMap<>();
        map.put("music",ms.getMusic(musicId));
        return map;
    }
    @GetMapping("/getAllMusic")
    public HashMap<String, Object> getAllMusic() {
        HashMap<String, Object> map = ms.getAllMusic();
        return map;
    }

    @GetMapping("/getSearch")
    public HashMap<String, Object> getSearch(@RequestParam("key")String key) {
        HashMap<String, Object> map = ms.search(key);
        return map;
    }
    @GetMapping("/getAllArtist")
    public HashMap<String, Object> getAllArtist() {
        HashMap<String,Object> map= ms.getAllArtist();
        return map;
    }
    @GetMapping("/getAllAlbum")
    public HashMap<String, Object> getAllAlbum() {
        HashMap<String,Object> map= ms.getAllAlbum();
        return map;
    }

    @PostMapping("/getCurrentPlaylist")
    public HashMap<String, Object> getCurrentPlaylist(@RequestBody List<HashMap<String,Object>> playlist) {
        HashMap<String, Object> map = ms.getCurrentPlaylist(playlist);
        return map;
    }

    @GetMapping("/getMemberPlaylist")
    public HashMap<String, Object> getMemberPlaylist(@RequestParam("memberId")String memberId) {
        System.out.println("요청받은 memberId: " + memberId);
        HashMap<String,Object> map= ms.getMemberPlaylist(memberId);
        return map;
    }

    @GetMapping("/getMemberRecentMusics")
    public HashMap<String, Object> getMemberRecentMusics(@RequestParam("memberId")String memberId) {
        HashMap<String,Object> map= ms.getMemberRecentMusics(memberId);
        return map;

    }


    // 인형 2/22~2/23
    @GetMapping("/recommend")
    public List<MusicDto> recommendMusic(@RequestParam("mood") String mood) {

        return ms.findMusicByMood(mood);
    }

    @GetMapping("/playlistDetail")
    public HashMap<String, Object> getPlaylistDetail(@RequestParam("playlistId")int playlistId) {

        System.out.println("요청받은 playlistId: " + playlistId);

        HashMap<String, Object> map = new HashMap<>();
        PlaylistDto playlist = ms.getPlaylistDetail(playlistId);

        if (playlist != null) {
            map.put("playlist", playlist);
        } else {
            map.put("error", "플레이리스트를 찾을 수 없습니다.");
        }

        return map;



    }
    @GetMapping("/getTop3")
    public HashMap<String, Object> getTop3() {
        HashMap<String,Object> map= ms.getTop3();
        return map;
    }
    
    // mainpage에서 최근 등록한 음악에 대한 정보 추출
    @GetMapping("/latestMusicList")
    public HashMap<String, Object> getLatestMusicList() {
        HashMap<String, Object> map = ms.getLatestMusicList();

        return map;
    }

    // mainpage에서 최근 등록된 앨범에 대한 정보 추출
    @GetMapping("/latestAlbumList")
    public HashMap<String, Object> getLatestAlbumList() {
        HashMap<String, Object> map = ms.getLatestAlbumList();
        return map;
    }

    // mainpage에서 최근 등록된 플레이 리스트에 대한 정보 추출
    @GetMapping("/latestPlayList")
    public HashMap<String, Object> getLatestPlayList() {
        HashMap<String, Object> map = ms.getLatestPlayList();
        return map;
    }


    @GetMapping("/download")
    public ResponseEntity<byte[]> downloadFile(@RequestParam("musicId")int musicId) throws IOException {
        MusicDto m= ms.getMusic(musicId);
        // S3에서 파일 다운로드
        File downloadedFile = ss.downloadFile(m.getBucketPath().replace("https://d9k8tjx0yo0q5.cloudfront.net/",""));

        if (downloadedFile == null) {
            return ResponseEntity.status(500).body("파일 다운로드 실패".getBytes());
        }

        // 파일 데이터를 byte[]로 읽기
        byte[] fileData = Files.readAllBytes(downloadedFile.toPath());

        // HTTP 응답에 파일 데이터 및 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + downloadedFile.getName());

        downloadedFile.delete();

        return ResponseEntity.ok()
                .headers(headers)
                .body(fileData);  // 실제 파일 데이터를 응답 본문에 포함
    }






    @GetMapping("/musicForMood")
    public HashMap<String, Object> musicForMood(@RequestParam("mood")String mood) {

        HashMap<String, Object> map = ms.getMusicForMood(mood);

        return map;

    }




    // 3/4 인형 안되면 걍 주석 ㅜㅜ 연결부분까지 쭈욱
    @GetMapping("/getPlaylistPage")
    public HashMap<String, Object> getPlaylistPage() {
        HashMap<String, Object> map = ms.getPlaylistPage();
        return map;
    }




}
