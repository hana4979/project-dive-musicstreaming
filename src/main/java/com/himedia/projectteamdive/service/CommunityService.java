package com.himedia.projectteamdive.service;

import com.himedia.projectteamdive.dto.AlbumDto;
import com.himedia.projectteamdive.dto.ArtistDto;
import com.himedia.projectteamdive.dto.MusicDto;
import com.himedia.projectteamdive.dto.PlaylistDto;
import com.himedia.projectteamdive.entity.*;
import com.himedia.projectteamdive.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Service
@Transactional
public class CommunityService {
    @Autowired
    LikesRepository lr;
    @Autowired
    ReplyRepository rr;
    @Autowired
    AllpageRepository apr;

    @Autowired
    MemberRepository mr;
    public void insertReply(Reply reply, String type, int entityId,String memberId) {
        Pagetype pagetype= Pagetype.valueOf(type);
        Allpage allpage=apr.findByEntityIdAndPagetype(entityId,pagetype);
        reply.setAllpage(allpage);
        reply.setMember(mr.findByMemberId(memberId));
        rr.save(reply);
    }

    public void deleteReply(int replyId) {
        Reply reply=rr.findByReplyId(replyId);
        rr.delete(reply);
    }

    public void insertLikes(String memberId, String type, int entityId) {
        Pagetype pagetype= Pagetype.valueOf(type);
        Allpage allpage=apr.findByEntityIdAndPagetype(entityId,pagetype);
        Member member=mr.findByMemberId(memberId);
        Likes likes=lr.findByMemberAndAllpage(member,allpage);
        if(likes==null){
            likes=new Likes(member,allpage);
            lr.save(likes);
        }else{
            lr.delete(likes);
        }
    }

    public List<Reply> getReply(String type, int entityId) {
        Pagetype pagetype= Pagetype.valueOf(type);
        Allpage allpage=apr.findByEntityIdAndPagetype(entityId,pagetype);
        List<Reply>replyList=rr.findByAllpage(allpage);
        return replyList;
    }
    @Autowired
    MusicRepository musicRepository;
    @Autowired
    AlbumRepository albumRepository;
    @Autowired
    ArtistRepository artistRepository;
    @Autowired
    PlaylistRepository playlistRepository;
    public List<Object> getLikes(String type, String memberId) {
        Pagetype pagetype = Pagetype.valueOf(type.toUpperCase());
        List<Likes>Likelist =lr.findByMemberIdAndPagetype(memberId, pagetype);
        List<Object>list=new ArrayList<>();

        for (Likes likes:Likelist) {
            Allpage allpage = likes.getAllpage();
            if (allpage == null) continue; // Null 방지

            Object dto = switch (pagetype) {
                case MUSIC -> {
                    Music music = musicRepository.findByMusicId(allpage.getEntityId());
                    yield (music != null) ? new MusicDto(music) : null;
                }
                case ALBUM -> {
                    Album album = albumRepository.findByAlbumId(allpage.getEntityId());
                    yield (album != null) ? new AlbumDto(album) : null;
                }
                case ARTIST -> {
                    Artist artist = artistRepository.findByArtistId(allpage.getEntityId());
                    yield (artist != null) ? new ArtistDto(artist) : null;
                }
                case PLAYLIST ->  {
                    Playlist playlist = playlistRepository.findByPlaylistId(allpage.getEntityId());
                    yield (playlist != null) ? new PlaylistDto(playlist) : null;
                }
            };

            if (dto != null) {
                list.add(dto);
            }
        }
        return list;
    }

    public List<Reply> getReplyList(String type, String memberId) {
        Pagetype pagetype = Pagetype.valueOf(type.toUpperCase());
        return rr.findByMemberIdAndPagetype(memberId, pagetype);
    }

    /* 좋아요 총 개수 조회 */
    public int getLikeCount(String type, int entityId) {
        // 페이지 타입 구하기
        Pagetype pageType = Pagetype.valueOf(type.toUpperCase());

        // 전체 페이지 테이블에 해당하는 콘텐츠의 정보 추출
        Allpage allPage = apr.findByEntityIdAndPagetype(entityId, pageType);

        // 좋아요 개수 반환
        return lr.countByAllpage(allPage);
    }

    @Autowired
    NoticeRepository nr;

    public List<Notice> getNoticeList() {
        return nr.findAll(); // 전체 공지 가져오기
    }
}
