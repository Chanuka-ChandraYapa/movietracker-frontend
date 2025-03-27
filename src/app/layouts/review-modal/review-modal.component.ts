import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReviewService } from '../../services/review.service'
import { Review } from '../../models/media.model';
import { User } from '../../models/user.model';
import { Media } from '../../models/media.model';

@Component({
  selector: 'app-review-modal',
  templateUrl: './review-modal.component.html',
  styleUrls: ['./review-modal.component.css'],
  standalone: false
})
export class ReviewModalComponent implements OnInit {
  reviewForm!: FormGroup;
  modalMode: 'create' | 'update' | 'delete';
  currentUser: User;
  currentMedia: Media;
  existingReview?: Review;

  constructor(
    private fb: FormBuilder,
    private reviewService: ReviewService,
    public dialogRef: MatDialogRef<ReviewModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      user: User, 
      media: Media, 
      review?: Review, 
      mode: 'create' | 'update' | 'delete'
    }
  ) {
    this.modalMode = data.mode;
    this.currentUser = data.user;
    this.currentMedia = data.media;
    this.existingReview = data.review;
  }

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.reviewForm = this.fb.group({
      content: ['', [
        Validators.required, 
        Validators.minLength(10), 
        Validators.maxLength(1000)
      ]],
      containsSpoilers: [false]
    });

    // If updating, populate form with existing review
    if (this.modalMode === 'update' && this.existingReview) {
      this.reviewForm.patchValue({
        content: this.existingReview.content,
        containsSpoilers: this.existingReview.containsSpoilers
      });
    }

    // Disable form for delete mode
    if (this.modalMode === 'delete') {
      this.reviewForm.disable();
    }
  }

  onSubmit() {
    if (this.reviewForm.invalid && this.modalMode !== 'delete') {
      return;
    }

    switch (this.modalMode) {
      case 'create':
        this.createReview();
        break;
      case 'update':
        this.updateReview();
        break;
      case 'delete':
        this.deleteReview();
        break;
    }
  }

  createReview() {
    const reviewData: Partial<Review> = {
      content: this.reviewForm.get('content')?.value || '',
      containsSpoilers: this.reviewForm.get('containsSpoilers')?.value
    };

    this.reviewService.createReview(
      this.currentUser.id, 
      this.currentMedia.id, 
      reviewData
    ).subscribe({
      next: (createdReview) => {
        this.dialogRef.close(createdReview);
      },
      error: (error) => {
        console.error('Error creating review', error);
        // Handle error (e.g., show error message)
      }
    });
  }

  updateReview() {
    if (!this.existingReview) return;

    const reviewData: Partial<Review> = {
      content: this.reviewForm.get('content')?.value || '',
      containsSpoilers: this.reviewForm.get('containsSpoilers')?.value
    };

    this.reviewService.updateReview(
      this.existingReview.id, 
      reviewData
    ).subscribe({
      next: (updatedReview) => {
        this.dialogRef.close(updatedReview);
      },
      error: (error) => {
        console.error('Error updating review', error);
        // Handle error (e.g., show error message)
      }
    });
  }

  deleteReview() {
    if (!this.existingReview) return;

    this.reviewService.deleteReview(this.existingReview.id).subscribe({
      next: () => {
        this.dialogRef.close(null);
      },
      error: (error) => {
        console.error('Error deleting review', error);
        // Handle error (e.g., show error message)
      }
    });
  }

  closeModal() {
    this.dialogRef.close();
  }
}