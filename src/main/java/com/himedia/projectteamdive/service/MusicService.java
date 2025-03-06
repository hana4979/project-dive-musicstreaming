package com.himedia.projectteamdive.service;

import com.himedia.projectteamdive.dto.*;
import com.himedia.projectteamdive.entity.*;
import com.himedia.projectteamdive.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@EnableScheduling
@Service
@Transactional
public class MusicService {
    @Autowired
    MusicRepository mr;
    @Autowired
    AlbumRepository ar;
    @Autowired
    ArtistRepository arr;
    @Autowired
    PlaylistRepository pr;
    @Autowired
    AllpageRepository allr;
    @Autowired
    PlaycountlistRepository pcr;

    public void insertMusic(Music music) {
        Artist artist=arr.findByArtistId(music.getArtist().getArtistId());
        Album album=ar.findByAlbumId(music.getAlbum().getAlbumId());
        music.setArtist(artist);
        music.setAlbum(album);
        Music m=mr.save(music);


        Allpage allpage=new Allpage();
        allpage.setEntityId(m.getMusicId());
        allpage.setPagetype(Arrays.asList(Pagetype.MUSIC));
        allr.save(allpage);
    }


    public Album insertAlbum(Album album) {
        Artist artist=arr.findByArtistId(album.getArtist().getArtistId());
        album.setArtist(artist);
        Album a=ar.save(album);


        Allpage allpage=new Allpage();
        allpage.setEntityId(a.getAlbumId());
        allpage.setPagetype(Arrays.asList(Pagetype.ALBUM));
        allr.save(allpage);
        return a;
    }

    public Artist insertArtist(Artist artist) {
        Artist a=arr.save(artist);
        Allpage allpage=new Allpage();
        allpage.setEntityId(a.getArtistId());
        allpage.setPagetype(Arrays.asList(Pagetype.ARTIST));
        allr.save(allpage);
        return a;
    }

    @Autowired
    MemberRepository memr;
    public void insertPlayList(String username, Playlist playlist) {
        Member member = memr.findByMemberId(username);
        Playlist playList= pr.save(new Playlist().builder()
                .title(playlist.getTitle())
                .content(playlist.getContent())
                .coverImage(playlist.getCoverImage())
                .member(member)
                .build());
        playList.setMember(member);
        Allpage allpage=new Allpage();
        allpage.setEntityId(playList.getPlaylistId());
        allpage.setPagetype(Arrays.asList(Pagetype.PLAYLIST));
        allr.save(allpage);
    }


    @Autowired
    MemberRecentMusicsRepository mrmr;
    public void addPlayCount(HashMap<Integer,Integer> playCount,String memberId) {
        playCount.forEach((musicId,playcountToday)->{
            Music music= mr.findByMusicId(musicId);
            if(music!=null) {
                if(memberId!=null && !memberId.equals("")) {
                    MemberRecentMusics recentMusic=MemberRecentMusics.builder()
                            .member(memr.findByMemberId(memberId))
                            .music(music).build();
                    mrmr.save(recentMusic);
                    List<MemberRecentMusics> recentMusics=mrmr.findByMember_MemberIdOrderByIdAsc(memberId);
                    if(recentMusics.size()>30){
                        MemberRecentMusics recentMusic2=recentMusics.get(0);
                        mrmr.delete(recentMusic2);
                    }
                }

                music.setPlayCount(music.getPlayCount()+ playcountToday);
                long currentTimeMillis = System.currentTimeMillis();
                Timestamp indate = new Timestamp(currentTimeMillis);

                LocalDateTime midnightLocalDateTime = indate.toLocalDateTime().toLocalDate().atStartOfDay();
                indate= Timestamp.valueOf(midnightLocalDateTime);

                Playcountlist playcountlist= pcr.findByMusicAndMemberIdAndIndate(music,memberId,indate);
                if(playcountlist==null){
                    Playcountlist playcountlist2=new Playcountlist(music,memberId,indate,playcountToday);
                    pcr.save(playcountlist2);
                }else{
                    playcountlist.setPlayCount(playcountlist.getPlayCount()+playcountToday);
                }
            }

        });
    }

    @Scheduled(cron = "0 0 0 * * ?")  // 매일 자정에 실행
    public void deleteOldPages() {
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        List<Playcountlist> oldPages = pcr.findAllByIndateBefore(thirtyDaysAgo);
        pcr.deleteAll(oldPages);
    }


    public HashMap<String, Object> getMusicChart() {
        HashMap<String, Object> chart=new HashMap<>();
        Pageable pageable = PageRequest.of(0, 100); // 100개 제한

        Timestamp chartDays = new Timestamp(System.currentTimeMillis() - (30L * 24 * 60 * 60 * 1000)); // 30일 전
        //월간차트
        chart.put("Top100Month",pcr.findTop100ByMusicChart(chartDays, pageable));
        //국내월간차트
        chart.put("Top100MonthKor",pcr.findTop100ByMusicChartKor(chartDays, pageable));
        //해외월간차트
        chart.put("Top100MonthnoKor",pcr.findTop100ByMusicChartnoKor(chartDays, pageable));

        chartDays = new Timestamp(System.currentTimeMillis() - (7L * 24 * 60 * 60 * 1000)); // 7일 전
        //주간차트
        chart.put("Top100Week",pcr.findTop100ByMusicWeekCart(chartDays, pageable));

        chartDays = new Timestamp(System.currentTimeMillis() - (24L * 60 * 60 * 1000)); // 1일 전
        //일간차트
        chart.put("Top100toDay",pcr.findTop100ByMusictoday(chartDays, pageable));

        return chart;
    }

    public List<AlbumDto> getAlbumChart() {
        return ar.findTop10ByMusicPlayCount();
    }


    public ArtistDto getArtist(int artistId) {
        return new ArtistDto(arr.findByArtistId(artistId));
    }

    public AlbumDto getAlbum(int albumId) {
        return  new AlbumDto(ar.findByAlbumId(albumId));
    }

    public MusicDto getMusic(int musicId) {
        return  new MusicDto(mr.findByMusicId(musicId));
    }

    public HashMap<String, Object> search(String key) {
        HashMap<String, Object> result=new HashMap<>();
        result.put("artist",arr.findByArtistNameContainingIgnoreCase(key));
        result.put("album",ar.findByTitleContainingIgnoreCase(key));
        result.put("music",mr.findByTitleContainingIgnoreCase(key));
        result.put("musiclyrics",mr.findByLyricsContainingIgnoreCase(key));
        result.put("playlist",pr.findByTitleContainingIgnoreCase(key));
        return result;
    }

    public void updateArtist(Artist artist) {
        Artist a=arr.findByArtistId(artist.getArtistId());
        a.setArtistName(artist.getArtistName());
        a.setDebut(artist.getDebut());
        a.setCountry(artist.getCountry());
        a.setImage(artist.getImage());
        a.setContent(artist.getContent());
    }

    public void updateAlbum(Album album) {
        Album a=ar.findByAlbumId(album.getAlbumId());
        a.setArtist(arr.findByArtistId(album.getArtist().getArtistId()));
        a.setImage(album.getImage());
        a.setTitle(album.getTitle());
        a.setIndate(album.getIndate());
        a.setContent(album.getContent());
    }


    public void updateMusic(Music music) {
        Music m=mr.findByMusicId(music.getMusicId());
        m.setArtist(arr.findByArtistId(music.getArtist().getArtistId()));
        m.setAlbum(ar.findByAlbumId(music.getAlbum().getAlbumId()));
        m.setTitle(music.getTitle());
        m.setGenre(music.getGenre());
        m.setLyrics(music.getLyrics());
        m.setTitleMusic(music.isTitleMusic());
        m.setContent(music.getContent());
    }
    @Autowired
    S3Service ss;
    public void deleteArtist(int artistId) {
        Artist artist=arr.findByArtistId(artistId);
        List<Album>albumList=artist.getAlbums();
        for(Album album:albumList){
            List<Music>musicList=album.getMusicList();
            for(Music music:musicList){
                String s = music.getBucketPath().replace("https://d9k8tjx0yo0q5.cloudfront.net/","");
                ss.deleteFile(s);
            }
        }
        Allpage allpage=allr.findByEntityIdAndPagetype(artistId,Pagetype.ARTIST);
        allr.delete(allpage);
        arr.delete(artist);

    }

    public void deleteAlbum(int albumId) {
        Album album=ar.findByAlbumId(albumId);
        List<Music> musicList=album.getMusicList();
        for (Music music : musicList) {
            String s = music.getBucketPath().replace("https://d9k8tjx0yo0q5.cloudfront.net/","");
            ss.deleteFile(s);
        }
        Allpage allpage= allr.findByEntityIdAndPagetype(albumId,Pagetype.ALBUM);
        allr.delete(allpage);
        ar.delete(album);
    }

    public void deleteMusic(int musicId) {
        Music music=mr.findByMusicId(musicId);
        String s = music.getBucketPath().replace("https://d9k8tjx0yo0q5.cloudfront.net/","");
        ss.deleteFile(s);
        Allpage allpage= allr.findByEntityIdAndPagetype(musicId,Pagetype.MUSIC);
        allr.delete(allpage);
        mr.delete(music);
    }

    public void deletePlaylist(int playlistId) {
        Playlist playlist=pr.findByPlaylistId(playlistId);
        Allpage allpage=allr.findByEntityIdAndPagetype(playlistId,Pagetype.PLAYLIST);
        allr.delete(allpage);
        pr.delete(playlist);
    }

    public void updatePlaylist(Playlist playlist) {
        Playlist p=pr.findByPlaylistId(playlist.getPlaylistId());
        p.setTitle(playlist.getTitle());
        p.setContent(playlist.getContent());
        p.setCoverImage(playlist.getCoverImage());
        p.setShayringyn(playlist.isShayringyn());
    }

    @Transactional
    public void updatePlaylistAddMusic(int playlistId, List<Integer> musics) {
        Playlist playlist=pr.findByPlaylistId(playlistId);
        Set<Integer> existingMusicIds = playlist.getMusicList().stream().filter(music -> music != null)
                .map(music -> music.getMusicId()).collect(Collectors.toSet());

        for (int musicId : musics) {
            if (!existingMusicIds.contains(musicId)) {
                Music music = mr.findByMusicId(musicId);
                playlist.addMusic(music);
            }
        }
    }

    public void updatePlaylistDeleteMusic(int playlistId, List<Integer> musicIds) {
        Playlist playlist=pr.findByPlaylistId(playlistId);
        for (int musicId : musicIds) {
            Music music=mr.findByMusicId(musicId);
            playlist.removeMusic(music);
        }
    }

    public void updateAlbumReorder(List<Integer> musicIds, int albumId) {
        Album album=ar.findByAlbumId(albumId);
        List<Music> updatedMusicList =musicIds.stream().map(musicid -> mr.findByMusicId(musicid)).collect(Collectors.toList());
        album.setMusicList(updatedMusicList);
        album.reorderMusicList();
    }

    public void updatePlaylistReorder(int playlistId, List<Integer> musicIds) {
        Playlist playlist=pr.findByPlaylistId(playlistId);
        List<Music> updatedMusicList = musicIds.stream().map(musicid -> mr.findByMusicId(musicid)).collect(Collectors.toList());
        playlist.setMusicList(updatedMusicList);
    }

    public HashMap<String, Object> getAllMusic() {
        HashMap<String, Object> result=new HashMap<>();
        List<MusicDto>musicDtoList= mr.findAll().stream()
                .map(MusicDto::new).collect(Collectors.toList());
        result.put("music",musicDtoList);
        return result;
    }

    public HashMap<String, Object> getAllArtist() {
        HashMap<String, Object> result=new HashMap<>();
        List<ArtistDto> artistDtoList = arr.findAll().stream()
                .map(artist -> new ArtistDto(artist))  // Artist를 ArtistDTO로 변환
                .collect(Collectors.toList());
        result.put("artist",artistDtoList);
        return result;
    }

    public HashMap<String, Object> getAllAlbum() {
        HashMap<String, Object> result=new HashMap<>();
        List<AlbumDto> albumDtoList = ar.findAll().stream()
                        .map(AlbumDto::new).collect(Collectors.toList());
        result.put("album",albumDtoList);
        return result;
    }

//    public HashMap<String, Object> getCurrentPlaylist(List<HashMap<String, Object>> playlist) {
//        HashMap<String, Object> result=new HashMap<>();
//        for (HashMap<String, Object> playlistMap : playlist) {
//            Music music=mr.findByMusicId((int) playlistMap.get("musicId"));
//            playlistMap.put("src",music.getBucketPath());
//            playlistMap.put("title",music.getTitle());
//            playlistMap.put("artist",music.getArtist().getArtistName());
//        }
//        result.put("playlist",playlist);
//        return result;
//    }

    public HashMap<String, Object> getCurrentPlaylist(List<HashMap<String, Object>> playlist) {
        HashMap<String, Object> result = new HashMap<>();

        for (HashMap<String, Object> playlistMap : playlist) {
            Object musicIdObj = playlistMap.get("musicId");
            int musicId;

            if (musicIdObj instanceof Integer) {
                musicId = (Integer) musicIdObj;
            } else if (musicIdObj instanceof String) {
                musicId = Integer.parseInt((String) musicIdObj);
            } else if (musicIdObj instanceof List) {
                // List 형태로 들어오는 경우 처리 (ex. [123] 또는 ["123"])
                List<?> musicIdList = (List<?>) musicIdObj;
                if (!musicIdList.isEmpty() && musicIdList.get(0) instanceof Integer) {
                    musicId = (Integer) musicIdList.get(0);
                } else if (!musicIdList.isEmpty() && musicIdList.get(0) instanceof String) {
                    musicId = Integer.parseInt((String) musicIdList.get(0));
                } else {
                    throw new IllegalArgumentException("Invalid musicId type in list: " + musicIdList);
                }
            } else {
                throw new IllegalArgumentException("Invalid musicId type: " + musicIdObj);
            }

            // Music 객체 조회
            Music music = mr.findByMusicId(musicId);
            playlistMap.put("src", music.getBucketPath());
            playlistMap.put("title", music.getTitle());
            playlistMap.put("artist", music.getArtist().getArtistName());
        }

        result.put("playlist", playlist);
        return result;
    }


    public HashMap<String, Object> getMemberPlaylist(String memberId) {
        HashMap<String, Object> result=new HashMap<>();
        List<PlaylistDto>list=pr.findAllByMember_MemberId(memberId);
        result.put("playlist",list);
        return result;

    }

    public HashMap<String, Object> getMemberRecentMusics(String memberId) {
        HashMap<String, Object> result=new HashMap<>();
        List<MemberRecentMusicsDto> musics=mrmr.findByMember_MemberId(memberId);
        result.put("musics",musics);
        return result;
    }

    public List<MusicDto> findMusicByMood(String mood) {

        List<Music> musicList = mr.findByMoodContaining(mood);

        // 엔티티 → DTO 변환
        return musicList.stream()
                .map(MusicDto::new)
                .collect(Collectors.toList());
    }

    public PlaylistDto getPlaylistDetail(int playlistId) {
        Optional<Playlist> playlist = pr.findById(playlistId);

        return playlist.map(PlaylistDto::new).orElse(null);
    }
    @Autowired
    LikesRepository lr;
    public HashMap<String, Object> getTop3() {
        HashMap<String, Object> result=new HashMap<>();
        List<Object[]>artists= lr.findLikesRanking(Pagetype.ARTIST);
        List<Object[]>albums= lr.findLikesRanking(Pagetype.ALBUM);
        List<Object[]>musics= lr.findLikesRanking(Pagetype.MUSIC);

        List<ArtistDto> artistList = new ArrayList<>();
        for (Object[] a : artists) {
            if (a[0] != null) {
                Integer id = ((Number) a[0]).intValue(); // 안전한 변환
                artistList.add(new ArtistDto(arr.findByArtistId(id)));
            }
        }

        List<AlbumDto> albumList = new ArrayList<>();
        for (Object[] a : albums) {
            if (a[0] != null) {
                Integer id = ((Number) a[0]).intValue();
                albumList.add(new AlbumDto(ar.findByAlbumId(id)));
            }
        }

        List<MusicDto> musicList = new ArrayList<>();
        for (Object[] a : musics) {
            if (a[0] != null) {
                Integer id = ((Number) a[0]).intValue();
                musicList.add(new MusicDto(mr.findByMusicId(id)));
            }
        }
        result.put("artist",artistList);
        result.put("album",albumList);
        result.put("music",musicList);
        return result;
    }


    public HashMap<String, Object> getLatestMusicList() {
        HashMap<String, Object> result = new HashMap<>();

        List<Integer> latestMusicIds = mr.getLatestMusicIds(PageRequest.of(0, 9));

        if (latestMusicIds == null || latestMusicIds.isEmpty()) {
            result.put("latestMusicList", new ArrayList<>()); // 빈 리스트 반환
            return result;
        }else {
            List<MusicDto> latestMusicList = mr.getMusicByIds(latestMusicIds);
            result.put("latestMusicList", latestMusicList);
        }
        return result;
    }

    public HashMap<String, Object> getLatestAlbumList() {
        HashMap<String, Object> result = new HashMap<>();
        List <Integer> latestAlbumIds = ar.getLatestAlbumIds(PageRequest.of(0,9));
        if(latestAlbumIds == null || latestAlbumIds.isEmpty()) {
            result.put("latestAlbumList", new ArrayList<>());
            return result;
        }else{
            List<AlbumDto> latestAlbumList = ar.getAlbumByIds(latestAlbumIds);
            result.put("latestAlbumList", latestAlbumList);
        }
        return result;

    }

    public HashMap<String, Object> getLatestPlayList() {
        HashMap<String, Object> result = new HashMap<>();
        List <Integer> latestPlayListIds = pr.getLatestPlayListIds(PageRequest.of(0,9));
        if(latestPlayListIds == null || latestPlayListIds.isEmpty()) {
            result.put("latestPlayListList", new ArrayList<>());
            return result;
        }else{
            List<PlaylistDto> latestPlayListofList = pr.getPlaylistByIds(latestPlayListIds)
                    .stream()
                    .map(PlaylistDto::new)
                    .collect(Collectors.toList());
            result.put("latestPlayListList", latestPlayListofList);
        }
        return result;
    }



    public List<MusicDto> getMusicByMood(String mood) {
        List<Music> musicList = mr.findByMood(mood);

        return musicList.stream()
                .map(MusicDto::new)
                .collect(Collectors.toList());
    }

    public HashMap<String, Object> getMusicForMood(String mood) {
        return null;
    }

    public HashMap<String, Object> getPlaylistPage() {

        HashMap<String, Object> result = new HashMap<>();

        // 다이브픽: 일단 인데이트순
        List<Playlist> divePickPlaylists = pr.findAll(Sort.by(Sort.Direction.DESC, "indate"));
        List<PlaylistDto> divePick = divePickPlaylists.stream()
                .map(PlaylistDto::new)
                .collect(Collectors.toList());
        result.put("divePick", divePick);

        //  핫 플레이리스트: 좋아요 수
        List<Playlist> hotPlaylists = pr.findHotPlaylists(Pagetype.PLAYLIST);
        List<PlaylistDto> hotPlaylist = hotPlaylists.stream()
                .map(PlaylistDto::new)
                .collect(Collectors.toList());
        result.put("hotPlaylist", hotPlaylist);

        //  랜덤 플레이리스트
        List<Playlist> allPlaylists = pr.findAll();
        if (allPlaylists != null && !allPlaylists.isEmpty()) {
            Collections.shuffle(allPlaylists);
            List<Playlist> randomPlaylists = allPlaylists.stream().limit(5).collect(Collectors.toList());
            List<PlaylistDto> randomPlaylist = randomPlaylists.stream()
                    .map(PlaylistDto::new)
                    .collect(Collectors.toList());
            result.put("randomPlaylist", randomPlaylist);
        } else {
            result.put("randomPlaylist", new ArrayList<>());
        }

        return result;
    }
}