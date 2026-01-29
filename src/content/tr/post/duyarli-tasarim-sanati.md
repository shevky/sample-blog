---
id: eo4nnshw3h
lang: tr
title: Duyarlı Tasarım Sanatı
slug: duyarli-tasarim-sanati
category: yasam-ogrenme
tags:
  - css
  - tasarim
  - erisilebilirlik
readingTime: 8
date: 2025-01-12
updated: 2025-01-18
pair: the-art-of-responsive-design
canonical: ~/duyarli-tasarim-sanati/
alternate: ~/en/the-art-of-responsive-design/
description: Ekran boyutlarına göre kırılmayan düzenler, akışkan tipografi ve erişilebilir etkileşimler tasarlamak için uygulanabilir teknikler.
keywords:
  - duyarlı tasarım
  - css grid
  - tipografi
featured: true
cover: https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80
coverAlt: Dizüstü bilgisayar etrafında responsive tasarım eskizleri
template: post
layout: default
status: published
---

Responsive tasarım artık sadece "mobilde alt alta gelsin" yaklaşımından ibaret değil. İçerik ağırlıklı projelerde bile, konteyner sorguları ve akışkan tipografi sayesinde tüm cihazlarda kaslı görünen deneyimler oluşturabiliriz.

## Kırılım noktalarından önce bağlamları tanımlayın

Desteklemeniz gereken uç senaryoları yazın: 320px genişliğinde bir telefon, koyu modlu 5K ekran veya yüksek kontrastlı bir Windows cihazı… Bu bağlamları belirledikten sonra kırılım noktaları kendiliğinden ortaya çıkıyor. Ben genellikle sıkışık, rahat ve geniş olmak üzere üç katmanla başlıyorum.

## Düzenleri modern CSS ile kurun

CSS Grid + Flexbox ikilisi artık standart. `repeat(auto-fit, minmax(280px, 1fr))` gibi kalıplar kart sayısını düşünmeden akışkan düzenler kurmamı sağlıyor. Çağrı alanlarını öne çıkarmak için grid satırlarını genişletiyor, medya bloklarını `aspect-ratio` ile kilitliyorum. Böylece uzun Türkçe başlıklar bile taşıyıcılarını zorlamıyor.

## Tipografiyi akışkan düşünün

`clamp()` kullanarak yazı boyutlarını min–max değerleri arasında otomatik ölçekleyin. Tema renklerini CSS değişkenleriyle yönettiğinizde koyu mod bile aynı ritmi korur. Kullanıcı tercihleri `prefers-reduced-motion` ve `prefers-contrast` sorgularıyla kolayca desteklenir.

## Erişilebilirliği unutmayın

Her etkileşim, ekran okuyuculara anlamlı bir isim, odak sırası ve görsel karşılık sunmalı. Axe veya Storybook eklentileriyle otomatik kontroller ekleyerek regresyonların build aşamasında yakalanmasını sağlayabilirsiniz.

Duyarlı tasarım bir sistem problemidir. İçerik, tasarım ve kodu ortak prensiplerle yönettiğinizde hem Türkçe hem İngilizce içerikler aynı kalite standardını paylaşır.
